import React from 'react';
import ReactDOM from 'react-dom';
import './styles.scss';
import App from './components/app/app';
import configureStore from './store/store';
import * as serviceWorker from './service-worker';
import {Provider} from "react-redux";
import {isLoggedIn} from "./store/thunks";

const renderApp = preloadedState => {
    const store = configureStore(preloadedState);
    ReactDOM.render(
        <Provider store={store}>
            <App/>
        </Provider>,
        document.getElementById('root'));
};

(async () => renderApp(await isLoggedIn()))();


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();