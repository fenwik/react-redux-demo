import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import rootRoute from 'getRoutes';
import configureStore from './store/configureStore';

const store = configureStore(browserHistory, window.__data);
const history = syncHistoryWithStore(browserHistory, store);

/** Root component with ReactJs - Redux Provider and routes. */
export default class Root extends Component {
  render () {
    return (
      <Provider store={store}>
        <Router
          history={history}
          routes={rootRoute} />
      </Provider>
    );
  }
}
