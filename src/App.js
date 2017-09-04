import React, { Component } from 'react';
import { hello } from "./hello.ts";
import { List, Record } from "immutable";
import { AddTodo } from "./components/AddTodo";
import { TodoList, Todo } from "./components/TodoList";
import { TodoRecord } from "./store/todo";




function Main ({ children }) {
    return (
        <section className={"mw8-l measure-narrow mw7-ns ml-auto mr-auto flex flex-column justify-center"}>{children}</section>
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
