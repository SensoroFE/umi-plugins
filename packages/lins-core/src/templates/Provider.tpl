import React from 'react';
import { init, App } from 'lins-core';

init({{{config}}})

export default (props) => {
  return (
    <App {...props} />
  )
}
