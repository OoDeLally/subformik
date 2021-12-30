import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {SubFormik } from '../src'

describe('it', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<SubFormik path="foo" />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
