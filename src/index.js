import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import FoodFinders from './FoodFinders';
import * as serviceWorker from './serviceWorker';

/* eslint-disable react/jsx-filename-extension */
ReactDOM.render(<FoodFinders />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
