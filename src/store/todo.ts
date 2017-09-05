import { List, Record, Map } from "immutable";
import { createStreamMiddleware } from "./streamMiddleware";
import { Action } from "redux";






export namespace Todo {

    export namespace status {
        export const todo = "todo/status/TO-DO";
        export const done = "todo/status/DONE";
        export const removed = "todo/status/REMOVED";
    }

    export const of = Record({
        task: "",
        _id: "",
        status: status.todo
    }, "Todo");

    export const Null = of();
    export type Todo = typeof Null;

    export interface State extends Map<string, Todo> {
    }

    export const add = "todo/ADD_TODO";
    export const added = "todo/ADDED_TODO";
    export const remove = "todo/REMOVE_TODO";
    export const removed = "todo/REMOVED_TODO";
    export const updated = "todo/UPDATED-TODO";
    export interface Add extends Action {
        type: typeof add;
        data: Todo
    }
    export interface Added extends Action {
        type: typeof added;
        data: Todo
    }
    export interface Remove extends Action {
        type: typeof remove;
        data: Todo
    }
    export interface Removed extends Action {
        type: typeof removed;
        data: Todo
    }
    export interface Updated extends Action {
        type: typeof updated;
        data: Todo
    }

    export type Actions = Add |
         Added |
         Remove |
         Removed |
        Updated;

}





export function reducer ( state: Todo.State = Map(), action: Todo.Actions ) {
    const { type } = action;
    switch ( type ) {
        case Todo.updated:
        case Todo.added:{
            const todo = (<Todo.Added>action).data;
            return state.set(todo.get("_id"), todo);
        }
        case Todo.removed:{
            const todo = (<Todo.Removed>action).data;
            return state.delete(todo.get("_id"));
        }
        default:
            return state;
    }
}


export const middleware = createStreamMiddleware(action$ => {

    return action$
        .filter( action => action.type === Todo.add )
        .map( ( action: Todo.Add ) => {
            return {
                type: Todo.added,
                data: action.data.set("_id", Date.now().toString())
            } as Todo.Added;
        });

});
