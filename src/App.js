import React, { Component } from 'react';
import { hello } from "./hello.ts";
import { List, Record } from "immutable";
import noop from 'lodash/noop';
import join from 'lodash/join';
import { css } from "glamor";


const inputStyleFocus = css({
    "&:focus": {
        borderBottom: "solid 1px black"
    }
});
const TodoRecord = Record({
    task: ""
});



function Main ({ children }) {
    return (
        <section className={"mw8-l measure-narrow mw7-ns ml-auto mr-auto flex flex-column justify-center"}>{children}</section>
    );
}


function AddTodo ({ onAdd = noop }) {

    return (
        <form className="dib pa1 flex justify-center">
            <label
                className="mr3" 
            >
                New todo : <input 
                    className={join(["bn input-reset pa2 w-100", inputStyleFocus], " ")}
                    placeholder="a todo"
                    type="text"
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


function TodoList ({ todos = List() }) {
    return (
        <ul className="dib pa1 list">
            {todos.map(( todo, index ) => <Todo todo={todo} key={index}/>)}
        </ul>
    );

}


function Todo ({ todo = TodoRecord() }) {
    return (
        <li className="mt2 mb2">
            {todo.get("task")}
        </li>
    );

}

const dummyData = List(["aller au travail", "faire des apps"])
    .map(task => ({ task }))
    .map(TodoRecord);


class App extends Component {
    render() {
        return (
            <Main>
                <h3>Todo List</h3>
                <AddTodo />
                <TodoList 
                    todos={dummyData}
                />
            </Main>
        );
    }
}

export default App;
