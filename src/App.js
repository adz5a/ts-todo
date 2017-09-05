import React, { Component } from 'react';
// import { hello } from "./hello.ts";
import { List, } from "immutable";
import { AddTodo } from "./components/AddTodo";
import { TodoList } from "./components/TodoList";
import { Todo } from "./store/todo";




function Main ({ children }) {
    return (
        <section className={"mw8-l measure-narrow mw7-ns ml-auto mr-auto flex flex-column justify-center"}>{children}</section>
    );
}






const dummyData = List(["aller au travail", "faire des apps"])
    .map(task => ({ task, _id: Math.random() }))
    .map(Todo.of);


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
