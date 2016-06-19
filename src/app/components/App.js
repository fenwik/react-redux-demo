import React, { Component, Children, cloneElement } from 'react';

/** Base container with layout. */
export default class App extends Component {
  render () {
    const { children } = this.props;
    const childrenWithProps = this.createChildrenWithProps(children);

    return (
      <div>
        <h1>Fenwik demo webapp</h1>
        <div className="page-content">
          {childrenWithProps}
        </div>
      </div>
    );
  }

  createChildrenWithProps(children) {
    return Children.map(children, (child) => {
      return cloneElement(child, {
        applicationName: 'Fenwik',
      });
    });
  }
}

App.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  },

  store: React.PropTypes.object.isRequired,
};

App.propTypes = {
  children: React.PropTypes.object.isRequired,
};
