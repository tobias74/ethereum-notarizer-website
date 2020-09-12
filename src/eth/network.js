import Web3 from 'web3';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Authereum from "authereum";

const providerOptions = {
  authereum: {
    package: Authereum // required
  }
};

const web3Modal = new Web3Modal({
  cacheProvider: false,
  providerOptions
});



let myWeb3;


web3Modal.connect().then((provider) => {
  myWeb3 = new Web3(provider);
});






export function getWeb3() {

  return myWeb3;
}

