import React, { Component } from 'react';
import logo from './logo.svg';
import { hello } from "./hello.ts";

class App extends Component {
    render() {
        return (
            <p>{hello("world")}</p>
        );
    }
}

export default App;
