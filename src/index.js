import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Login from './components/signin'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

/* testing components */

import Dashboard from './components/dashboard/dashboard'

/* testing components */

ReactDOM.render(
  
    <App />,
  document.getElementById('root')
);


serviceWorker.unregister();
