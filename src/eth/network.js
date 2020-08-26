import Web3 from 'web3';

let myWeb3;

export function getWeb3() {
  if (typeof window.web3 !== 'undefined') {
    // this statement is executed if you are using 
    // MetaMask 
    async function enableAccounts() {
      await window.ethereum.enable()
    }
    enableAccounts();
    myWeb3 = window.web3;
  } else {
    // set the provider you want from Web3.providers
    myWeb3 = new Web3(
      new Web3.providers.HttpProvider(
        "http://localhost:8545"));
  }

  return myWeb3;
}

