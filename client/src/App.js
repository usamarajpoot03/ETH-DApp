import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import "./App.css";
import Navbar from "./components/navbar";
import NotFound from "./components/not-found";
import HomePage from "./components/homepage";
import DeXTokens from "./components/dexTokens";

class App extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <Switch>
          <Route path="/dexTokens" component={DeXTokens}></Route>
          <Route path="/not-found" component={NotFound}></Route>
          <Route path="/" exact component={HomePage}></Route>
          <Redirect to="/not-found"> </Redirect>
        </Switch>
      </div>
    );
  }
}

export default App;
