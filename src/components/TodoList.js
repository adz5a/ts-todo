import React from 'react';
import { Seq, } from "immutable";
import { Todo as  TodoNS } from "../store/todo";
import { selector } from "../store/createStore";
import { connect } from "react-redux";
import noop from "lodash/noop";
import Check from "react-icons/lib/md/check";
import Remove from "react-icons/lib/md/highlight-remove";


export function Todo ({
    todo = TodoNS.Null,
    onRemove = noop,
    onUpdateStatus = noop,
}) {


    const taskStyle = todo.status === TodoNS.status.removed ?
        "strike":
        "";

    return (
        <li className="mt2 mb2 flex justify-between items-center">
            <span className={taskStyle}>
                {todo.status === TodoNS.status.done ?
                        <Check />:
                        null}
                {todo.task}
            </span>
            <span>
                <select
                    value={todo.status}
                    onChange={e => {

                        const newStatus = e.target.value;
                        onUpdateStatus(todo, newStatus);

                    }}
                    className="reset-input bg-white dib pa2 w4 ttc mr2">
                    <option value={TodoNS.status.done}>{"done"}</option>
                    <option value={TodoNS.status.todo}>{"to do"}</option>
                    <option value={TodoNS.status.removed}>{"removed"}</option>
                </select>
                <Remove className="grow pointer" onClick={onRemove}/>
            </span>
        </li>
    );

}


export function TodoListView ({
    todos = Seq(),
    onTodoRemove = noop,
    onUpdateStatus = noop
}) {
    return (
        <section>
            <section>

            </section>
            <ul className="dib pa1 list">
                {todos
                        .map(( todo, index ) => <Todo
                            todo={todo}
                            key={todo.get("_id")}
                            onRemove={() => onTodoRemove(todo)}
                            onUpdateStatus={onUpdateStatus}
                        />)
                        .toArray()
                }
            </ul>
        </section>
    );


}

export const TodoList = connect(
    state => ({ todos: selector.todo(state).toSeq() }),
    {
        onTodoRemove ( todo ) {
            return {
                type: TodoNS.removed,
                data: todo
            };
        },
        onUpdateStatus ( todo, newStatus ) {
            return {
                type: TodoNS.updated,
                data: todo.set("status", newStatus)
            };
        }
    }
)(TodoListView);

// export const TodoList = TodoListView;
