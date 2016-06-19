import httpProxy from 'http-proxy';
import Express from 'express';
import path from 'path';
import serialize from 'serialize-javascript';
import cookie from 'cookie-parser';
import bodyParser from 'body-parser';

import React from 'react';
import { renderToString } from 'react-dom/server';
import {Provider} from 'react-redux';
import { match } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { ReduxAsyncConnect, loadOnServer } from 'redux-async-connect';
import createHistory from 'history/lib/createMemoryHistory';
import useQueries from 'history/lib/useQueries';
import useBasename from 'history/lib/useBasename';

import rootRoute from '../getRoutes';
import configureStore from 'store/configureStore';

const app = new Express();
app.use(cookie());
app.use(bodyParser.json());

const targetUrl = '//localhost:8010/';
const proxy = httpProxy.createProxyServer({
  target: targetUrl,
  ws: true,
});

// Proxy to API server
app.use('/api', (req, res) => {
  proxy.web(req, res, { target: targetUrl });
});

app.use('/favicon.ico', (req, res) => {
  res.status(404);
  res.send('');
});

proxy.on('error', (error, req, res) => {
  if (!res.headersSent) {
    res.writeHead(500, { 'content-type': 'application/json' });
  }

  const json = { error: 'proxy_error', reason: error.message };
  res.end(JSON.stringify(json));
});

function createPage(html) {
  return `
  <!doctype html>
  <html>
    <head>
      <meta charset="UTF-8">
      <title>Fenwik demo application</title>
    </head>
    ${html}
  </html>
  `;
}

const renderOnServer = (req, res) => {
  let originalUrl = req.originalUrl;
  if (originalUrl == '/null') {
    originalUrl = '/';
  }

  const memoryHistory = useQueries(useBasename(createHistory))(originalUrl);
  const store = configureStore(memoryHistory, {}, req);
  const history = syncHistoryWithStore(memoryHistory, store);

  match({ history, routes: rootRoute, location: originalUrl }, (err, redirect, renderProps) => {
    // 1. load data
    loadOnServer(Object.assign({}, renderProps, { store })).then(() => {
      try {
        if (redirect) {
          res.redirect(redirect.pathname + redirect.search);
        } else if (err) {
          res.status(500);
          res.send('ERROR');
        } else if (renderProps) {
          // 2. use `ReduxAsyncConnect` instead of `RoutingContext` and pass it `renderProps`
          const component = (
            <Provider store={store} key="provider">
              <ReduxAsyncConnect {...renderProps} />
            </Provider>
          );

          let appHTML, scriptHtml;
          try {
            appHTML = renderToString(component);
          } catch (e) {
            console.log(e, e.stack);
          }

          const scrpt = (
            <script dangerouslySetInnerHTML={{ __html: `window.__data=${serialize(store.getState())};` }}
              charSet="UTF-8"/>
          );
          scriptHtml = renderToString(scrpt);

          appHTML = `
          <body>
            <div id="app">${appHTML}</div>
            ${scriptHtml}
            <script src="/build/app.js"></script>
          </body>;`;

          // 3. render the Redux initial data into the server markup
          const html = createPage(appHTML);
          res.status(200);
          res.send(html);
        } else {
          res.status(404).send('Not found');
        }
      } catch (e) {
        console.log([e, e.stack]);
      }
    });
  });
};

app.get('/', renderOnServer);
app.use(Express.static(path.join(__dirname, '..', '..', '..')));
app.get('*', renderOnServer);

app.listen(3000, function () {
  /* eslint no-console: "off" */
  console.log('Example app listening on port 3000!');
});
