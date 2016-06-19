import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import PizzaTopping from 'widgets/PizzaTopping';

class PizzaDetail extends Component {
  render() {
    const { pizzas, params } = this.props;
    const pizzaId = parseInt(params.pizzaId);

    if (!pizzas.data)
      return (<div>Loading ...</div>);

    const pizza = pizzas.data.find(p => p.id == pizzaId);
    if (!pizza)
      return (<div>Pizza was not found - please check pizza id.</div>);

    return (
      <div className="container pizza-detail-container">
        <Link to={{ pathname: '/' }}>Back to menu</Link>
        <h1>{pizza.name}</h1>
        <h2>{pizza.price}</h2>
        {pizza.toppings &&
          <ul className="topping-list">
            {pizza.toppings.map((topping, i) =>
              <li key={`topping_${i}`}><PizzaTopping name={topping} /></li>
            )}
          </ul>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    pizzas: state.pizzas,
  };
}

export default connect(mapStateToProps)(PizzaDetail);

PizzaDetail.propTypes = {
  pizzas: React.PropTypes.object.isRequired,
  params: React.PropTypes.object.isRequired
};
