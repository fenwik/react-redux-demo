import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import { loadPizzas } from 'actions/pizzas';

class PizzaList extends Component {
  componentWillMount() {
    this.props.loadPizzas();
  }

  render() {
    const { pizzas, children } = this.props;

    return (
        <div className="container pizza-list-container">
          {!children &&
            <ul className="pizza-list">
              {pizzas.data && pizzas.data.map(pizza =>
                <li key={`pizza_${pizza.id}`} className="pizza-item">
                  <Link to={{ pathname: `/${pizza.id}/` }}>{pizza.name}</Link>
                </li>
              )}
            </ul>
          }
          {children}
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    pizzas: state.pizzas,
  };
}

export default connect(mapStateToProps, {
  loadPizzas,
})(PizzaList);

PizzaList.propTypes = {
  applicationName: React.PropTypes.string,
  children: React.PropTypes.object,
  pizzas: React.PropTypes.object.isRequired,
  loadPizzas: React.PropTypes.func.isRequired,
};
