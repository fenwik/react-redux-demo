import { GET_PIZZAS } from '../constants';

function createReducer(initialState, reducerMap) {
  return (state, action) => {
    if (!state) {
      state = initialState;
    }

    const reducer = reducerMap[action.type];

    return reducer ? reducer(Object.assign({}, state), action) : state;
  };
}

function createRequestReducer(state, action, reducerMap) {
  const reducer = reducerMap[action.status];

  return reducer ? reducer(state, action) : state;
}

const initialState = {
  isFetching: false,
  data: null,
  error: null,
};

export default createReducer(initialState, {
  [GET_PIZZAS]: (state, action) =>
    createRequestReducer(state, action, {
      SUCCESS: (state) => {
        return Object.assign({}, state, {
          data: action.response,
        });
      },
    }),
});
