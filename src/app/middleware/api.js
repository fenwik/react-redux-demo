import cookie from 'cookie';
import 'isomorphic-fetch';
import queryString from 'query-string';

function callApi(endpoint, method, data, queryParams, options) {
  let fullUrl = options.apiRoot + endpoint;
  let requestOptions = {
    method: method,
    credentials: 'same-origin',
    headers: {
      'Accept': 'application/json',
    },
  };

  if (options.csrfToken) {
    requestOptions.headers['X-CSRFToken'] = options.csrfToken;
  }

  if (queryParams && typeof queryParams == 'object') {
    fullUrl += '?' + queryString.stringify(queryParams);
  }

  if (data) {
    requestOptions.headers['Content-Type'] = 'application/json';
    requestOptions.body = JSON.stringify(data);
  }

  return fetch(fullUrl, requestOptions)
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => {
          throw err;
        });
      }

      if (method == 'DELETE') {
        return {};
      }

      return response.json().then(json => json);
    });
}

function makeOptions(req, store, apiRoot) {
  let hostname, port, apiPath, csrfToken;

  if (req) {
    hostname = 'localhost';
    port = ':8010';
    apiPath = '/';
    csrfToken = req.cookies.csrftoken;

  } else if (window && window.location) {
    hostname = window.location.hostname;
    port = (window.location.port) ? `:${window.location.port}` : '';
    apiPath = apiRoot;

    if (cookie.parse(document.cookie).csrftoken) {
      csrfToken = cookie.parse(document.cookie).csrftoken;
    }

  }else {
    return null;

  }

  return {
    apiRoot: `http://${hostname}${port}${apiPath}`,
    csrfToken,
  };
}

function actionWith(action, status, obj) {
  if (!obj) obj = {};
  return Object.assign({}, action, { status: status }, obj);
}

export default function createApiMiddleware(req) {
  return store => next => action => {
    if (!action) return;

    if (typeof action.meta === 'undefined') {
      return next(action);
    }

    const { meta } = action;
    const { method, endpoint, data, queryParams } = meta;
    const { apiRoot } = meta;

    const options = makeOptions(req, store, apiRoot);

    const successCallback = response =>
      next(actionWith(action, 'SUCCESS', { response }));

    const failCallback = error =>
      next(actionWith(action, 'FAIL', { error: error || 'Something bad happened' }));

    if (!options) {
      throw Error('Can\'t send API request');
    }

    next(actionWith(action, 'SEND'));

    return callApi(endpoint, method, data, queryParams, options)
      .then(successCallback, failCallback);
  };
}
