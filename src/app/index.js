import React from 'react';
import { render } from 'react-dom';
import Root from './Root';

/** Rendering Root component. */
function app() {
  render(
    <Root />,
    document.getElementById('app')
  );
}

if (module.hot) {
  module.hot.accept();
}

app();
