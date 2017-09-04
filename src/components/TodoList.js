import React, { Component } from 'react';
import { List, } from "immutable";
import { TodoRecord } from "../store/todo";


export function TodoList ({ todos = List() }) {
    return (
        <ul className="dib pa1 list">
            {todos.map(( todo, index ) => <Todo todo={todo} key={index}/>)}
        </ul>
    );

}


export function Todo ({ todo = TodoRecord() }) {
    return (
        <li className="mt2 mb2">
            {todo.get("task")}
        </li>
    );

}
