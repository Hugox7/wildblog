import React, { Component } from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import Articles from './components/Articles';


class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar brand='logo' right>
            <NavItem onClick={() => console.log('test click')}>Getting started</NavItem>
            <NavItem href='components.html'>Components</NavItem>
        </Navbar>
        <Switch>
          <Route exact path = '/' component={Home} />
          <Route path = '/articles' component={Articles} />
        </Switch>
      </div>
    );
  }
}

export default App;
