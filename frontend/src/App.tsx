import logo from './logo.svg';
import './App.css'

import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';

import Amplify from 'aws-amplify';

declare const window: any;

Amplify.configure(window.ENV);

function App() {

  return (
   <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <AmplifySignOut />
      </header>
      
    </div>
  );
}

export default withAuthenticator(App);