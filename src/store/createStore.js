import { createStore, compose, applyMiddleware, combineReducers } from "redux";
import {
    reducer as todo,
    middleware
} from "./todo";
import {
    middleware as firebaseMW
} from "./firebase";


export default function () {

    const reducer = combineReducers({ todo });
    let composeEnhancers = compose;

    if ( process.env.NODE_ENV !== "production" ) {


        composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


    }

    return  createStore(reducer, /* preloadedState, */ composeEnhancers(
        applyMiddleware(...[
            middleware,
            firebaseMW
        ])
    ));
}


export const todoSelector = state => state.todo;
export const selector = {
    todo: todoSelector
};
