import React from 'react';
import { css } from "glamor";
import { Todo } from "../store/todo.ts";
import { connect } from "react-redux";
import join from 'lodash/join';
import noop from 'lodash/noop';


const inputStyleFocus = css({
    "&:focus": {
        borderBottom: "solid 1px black"
    },
    "transition": "border-color 0.4s",
    "border": "solid 1px white"
});

const inputStyle = join(["bn input-reset pa2 w-100 outline-0 b", inputStyleFocus], " ");
export function AddTodoView ({ onAdd = noop }) {

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                onAdd(e.target.elements.todo.value);
            }}
            className="dib pa1 flex justify-center">
            <label
                className="mr3"
            >
                New todo : <input
                    className={inputStyle}
                    placeholder="a todo"
                    type="text"
                    name="todo"
                />
            </label>
            <input
                className="input-reset button-reset ba b--black bg-white pa2 b hover-white hover-bg-black grow"
                value="Add"
                type="submit"
            />
        </form>
    );

}


export const AddTodo = connect(
    null,
    {
        onAdd ( task ) {
            return {
                type: Todo.add,
                data: Todo.of({ task })
            };
        }
    }
)(AddTodoView);
