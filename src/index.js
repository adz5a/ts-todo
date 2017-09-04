import React from 'react';
import ReactDOM from 'react-dom';
import 'tachyons/css/tachyons.css';
import App from './App';
import { Provider } from 'react-redux';
import createStore from './store/createStore';


ReactDOM.render(
    <Provider store={createStore()}>
        <App />
    </Provider> 
    ,
    document.getElementById('root'));
// registerServiceWorker();
