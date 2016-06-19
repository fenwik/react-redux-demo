import PizzaList from './components/PizzaList';
import PizzaDetailRoute from './routes/PizzaDetail';

export default {
  component: PizzaList,
  childRoutes: [
    PizzaDetailRoute,
  ],
};
