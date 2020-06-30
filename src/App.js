import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.css';
import Agents from './components/Agents';
import Teams from './components/Teams';
import Home from './components/Home'
import NotFound from './components/NotFound'
import CallAgentNavBar from './components/CallAgentNavBar';

const App = () => {
  return (
    <Router>
      <div className="App">
        <CallAgentNavBar />
        <br></br>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/agents' component={Agents} />
          <Route exact path='/teams' component={Teams} />
          <Route path="*" component={NotFound} />
        </Switch>
      </div>
    </Router>
  )
}

export default App;
