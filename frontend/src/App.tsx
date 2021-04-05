import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css'

import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';

import { API } from './lib/fetcher';

import Amplify from 'aws-amplify';

import { Todos } from './components/todos';

declare const window: any;

Amplify.configure(window.ENV);

function App() {

  useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData: any) => {
      API.updateIsSignedIn(nextAuthState === AuthState.SignedIn);
    });
  }, []);

  return (
    <div className="App">
    <nav className="Navbar">
      <h1 className="navbar-logo">Todolist - {window.ENV.stage || 'no'} Stage</h1>
      <ul className="nav-menu">
        <li> <a href="/todos">Todos</a></li>
      </ul>
      <AmplifySignOut />
    </nav>
    <div>
      <Router>
        <Switch>
          <Route exact path="/" render={(props: any) => <Todos {...props}/>} />
          <Route path="/todos" render={(props: any) => <Todos {...props}/>} />
        </Switch>
      </Router>
    </div>
  </div>
  );
}

export default withAuthenticator(App);