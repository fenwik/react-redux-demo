import React, { Component } from 'react';

export default class PizzaTopping extends Component {
  render() {
    const { name } = this.props;

    return (
      <span className="topping">{name}</span>
    );
  }
}

PizzaTopping.propTypes = {
  name: React.PropTypes.string.isRequired,
};
