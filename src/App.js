import React from 'react';
import logo from './logo.svg';
import './App.css';
import { getWeb3 } from './eth/network';
import NotarizerAbi from './eth/notarizer-abi';

class App extends React.Component {

  async componentDidMount() {
    console.log('COMPONENT DID MOUTN yeah');
    console.log('this is my web3:', getWeb3());
    console.log('tjhis is my ABI: ', NotarizerAbi);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload or what??
          </p>
          <a
      className="App-link"
      href="https://reactjs.org"
      target="_blank"
      rel="noopener noreferrer"
      >
            Learn React yeah??? We cool?
          </a>
        </header>
        
        More content:
      </div>
    );
  }
}

export default App;
