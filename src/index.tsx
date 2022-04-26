import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import {store} from './state/store';
import {Provider} from 'react-redux';
import AppWithRedux from './app/AppWithRedux'
import {BrowserRouter} from "react-router-dom";
//import AppWithReducers from "./trash/AppWithReducers";

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <AppWithRedux demo={false}/>
            {/*<AppWithReducers demo={true}/>*/}
        </BrowserRouter>
    </Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
