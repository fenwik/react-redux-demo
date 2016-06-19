import { GET_PIZZAS } from '../constants';

export function loadPizzas() {
  return (dispatch) => {
    return dispatch({
      type: GET_PIZZAS,
      meta: {
        method: 'GET',
        endpoint: 'pizzas/',
        apiRoot: '/api/',
      },
    });
  };
}
