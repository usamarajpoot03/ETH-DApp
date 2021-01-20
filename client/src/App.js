import React, { Component } from "react";
import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar } from "react-bootstrap";
import HomePage from "./components/HomePage";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar bg="light" expand="lg">
          <Navbar.Brand>ERC20 Mintable Token ( Tokenize Assets )</Navbar.Brand>
        </Navbar>
        <HomePage></HomePage>
      </div>
    );
  }
}

export default App;
