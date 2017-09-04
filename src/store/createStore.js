import { createStore, compose, applyMiddleware, combineReducers } from "redux";
import { 
    reducer as todo,
    middleware
} from "./todo";


export default function () {

    const reducer = combineReducers({ todo });
    let composeEnhancers = compose;

    if ( process.env.NODE_ENV !== "production" ) {


        composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


    }

    return  createStore(reducer, /* preloadedState, */ composeEnhancers(
        applyMiddleware(...[
            middleware
        ])
    ));
}
