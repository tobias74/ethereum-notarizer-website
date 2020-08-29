import React from 'react';


class HashBlockInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        blockInfo: props.blockInfo,
        networkName: props.networkName,
    };
  }

  getEthscanSubdomain() {
      if (this.state.networkName === 'mainnet') {
          return '';
      } else {
          return this.state.networkName + '.';
      }
  }

  render() {
    return (
      <React.Fragment>
        <h4>BlockInfo</h4>
        Minetime: {(new Date(this.state.blockInfo.mineTime * 1000)).toString()}
        <br/>
        Block numer: {this.state.blockInfo.blockNumber} 
        <a href={'https://' + this.getEthscanSubdomain() + 'etherscan.io/block/' + this.state.blockInfo.blockNumber} target="_blank">
        show on etherscan
        </a>
      </React.Fragment>
      );
  }
}

export default HashBlockInfo;
