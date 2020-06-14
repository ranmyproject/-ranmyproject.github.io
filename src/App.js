import Login from './components/login';
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';
import './App.css'

import Header from './components/shared/header'
import Authentication from './services/authentication';
import Dashboard from './components/user/dashboard';
import SubmissionList from './components/user/submission-list';
import Home from './components/user/home';
import Register from './components/register';

class App extends Component {
  render() {
    return (
      <Router>
        <Header/>
        <Switch>
          <Route path="/login" render={()=> (Authentication.isAuthenticated()?<Redirect to="/dashboard" />:<Login/>)}/>
          <Route path="/register" component={Register}/>
          <Route path="/post"  render={()=> (Authentication.isAuthenticated()?<SubmissionList/>:<Redirect to="/login"/>)}/>
          <Route path="/dashboard" render={()=> (Authentication.isAuthenticated()?<Dashboard/>:<Redirect to="/login"/>)}/>
          <Route path="/" render={()=> (Authentication.isAuthenticated()?<Home/>:<Redirect to="/login" />)}/>
          <Route path="*" render={()=> (Authentication.isAuthenticated()?<Redirect to="/"/>:<Redirect to="/login" />)}/>
        </Switch>
      </Router>
    );
  }
}

export default App;
