import { createStore, applyMiddleware, combineReducers } from 'redux';
import { routerReducer as routing, routerMiddleware } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import createApiMiddleware from '../middleware/api';

// import createApiMiddleware from 'middleware/api';
import reducers from 'reducers';

/**
 * Creating store function.
 * @param {object} initialState - Initial state.
 * @return {function}
 */
export default function configureStore(history, initialState, req) {
  const reduxRouterMiddleware = routerMiddleware(history);
  const middleware = [
    createApiMiddleware(req),
    reduxRouterMiddleware,
    thunkMiddleware,
  ];

  /** Creating store with middleware. */
  let createStoreWithMiddleware = applyMiddleware(...middleware)(createStore);

  /** Creating root reduser. */
  const rootReducer = combineReducers(Object.assign(reducers, { routing }));

  return createStoreWithMiddleware(rootReducer, initialState);
}
