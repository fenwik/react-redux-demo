import App from './components/App';
import PizzaMenuRoute from './routes/PizzaMenu';

/** Root routes object. */
const rootRoute = {
  component: 'div',
  childRoutes: [{
    path: '/',
    component: App,
    indexRoute: PizzaMenuRoute,
    childRoutes: [
      PizzaMenuRoute,
    ],
  }],
};

export default rootRoute;
