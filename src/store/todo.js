import { List, Record } from "immutable";


export const TodoRecord = Record({
    task: ""

});

export function reducer ( state = [], action ) {
    return state;
}


export function middleware ({ getState, dispatch }) {

    return next => action => next(action);

}
