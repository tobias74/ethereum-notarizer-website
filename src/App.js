import React from 'react';
import './App.css';
import NotarizerAbi from './eth/notarizer-abi';
import { sha256 } from 'js-sha256';

import Web3 from "web3";
import { convertUtf8ToHex } from "@walletconnect/utils";

import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

import Fortmatic from "fortmatic";
import Authereum from "authereum";
import UniLogin from "@unilogin/provider";


import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import StarIcon from '@material-ui/icons/StarBorder';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MatLink from '@material-ui/core/Link';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';

import HashBlockInfo from './components/HashBlockInfo';

import { DropzoneArea } from 'material-ui-dropzone'

import { supportedChains } from './eth/chains';

import Home from './pages/Home';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Made by '}
      <MatLink color="inherit" href="https://material-ui.com/">
        tobiga UG (haftungsbeschränkt)
      </MatLink>
    </Typography>
  );
}

const styles = (theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  mainContent: {
    padding: theme.spacing(1, 0, 2),
  },
  resultContent: {
    padding: theme.spacing(2),
  },
  dropZone: {
    minHeight: '0px',
    border: 'solid'
  },
  cardHeader: {
    backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
  },
  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2),
  },
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
  },
});

const tiers = [
  {
    title: 'Free',
    price: '0',
    description: ['10 users included', '2 GB of storage', 'Help center access', 'Email support'],
    buttonText: 'Sign up for free',
    buttonVariant: 'outlined',
  },
  {
    title: 'Pro',
    subheader: 'Most popular',
    price: '15',
    description: [
      '20 users included',
      '10 GB of storage',
      'Help center access',
      'Priority email support',
    ],
    buttonText: 'Get started',
    buttonVariant: 'contained',
  },
  {
    title: 'Enterprise',
    price: '30',
    description: [
      '50 users included',
      '30 GB of storage',
      'Help center access',
      'Phone & email support',
    ],
    buttonText: 'Contact us',
    buttonVariant: 'outlined',
  },
];
const footers = [
  {
    title: 'Company',
    description: ['Team', 'History', 'Contact us', 'Locations'],
  },
  {
    title: 'Features',
    description: ['Cool stuff', 'Random feature', 'Team feature', 'Developer stuff', 'Another one'],
  },
  {
    title: 'Resources',
    description: ['Resource', 'Resource name', 'Another resource', 'Final resource'],
  },
  {
    title: 'Legal',
    description: ['Privacy policy', 'Terms of use'],
  },
];


const INITIAL_STATE = {
  fetching: false,
  address: "",
  web3: null,
  provider: null,
  connected: false,
  chainId: 1,
  networkId: 1,
  showModal: false,
  pendingRequest: false,
  result: null
};

function initWeb3(provider) {
  const web3 = new Web3(provider);

  web3.eth.extend({
    methods: [
      {
        name: "chainId",
        call: "eth_chainId",
        outputFormatter: web3.utils.hexToNumber
      }
    ]
  });

  return web3;
}

export function getChainData(chainId) {
  const chainData = supportedChains.filter(
    (chain) => chain.chain_id === chainId
  )[0];

  if (!chainData) {
    throw new Error("ChainId missing or not supported");
  }

  const API_KEY = process.env.REACT_APP_INFURA_ID;

  if (
    chainData.rpc_url.includes("infura.io") &&
    chainData.rpc_url.includes("%API_KEY%") &&
    API_KEY
  ) {
    const rpcUrl = chainData.rpc_url.replace("%API_KEY%", API_KEY);

    return {
      ...chainData,
      rpc_url: rpcUrl
    };
  }

  return chainData;
}


class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      ...INITIAL_STATE,
      hashValue: '',
      currentStatus: '---',
      canFileBeHashed: false,
    };

    this.web3Modal = new Web3Modal({
      network: this.getNetwork(),
      cacheProvider: true,
      providerOptions: this.getProviderOptions()
    });
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeHashLookup = this.handleChangeHashLookup.bind(this);

    this.handleFileSubmit = this.handleFileSubmit.bind(this);
    this.handleFileCheck = this.handleFileCheck.bind(this);
    this.fileInput = React.createRef();

  }

  componentDidMount() {
    if (this.web3Modal.cachedProvider) {
      this.onConnect();
    }
  }

  onConnect = async () => {
    const provider = await this.web3Modal.connect();

    await this.subscribeProvider(provider);

    const web3 = initWeb3(provider);

    const accounts = await web3.eth.getAccounts();

    const address = accounts[0];

    const networkId = await web3.eth.net.getId();

    const chainId = await web3.eth.chainId();

    await this.setState({
      web3,
      provider,
      connected: true,
      address,
      chainId,
      networkId
    });
    this.loadNetworkContext();

  };

  subscribeProvider = async (provider) => {
    if (!provider.on) {
      return;
    }
    provider.on("close", () => this.resetApp());
    provider.on("accountsChanged", async (accounts) => {
      await this.setState({ address: accounts[0] });
      this.loadNetworkContext();
    });
    provider.on("chainChanged", async (chainId) => {
      const { web3 } = this.state;
      const networkId = await web3.eth.net.getId();
      await this.setState({ chainId, networkId });
      this.loadNetworkContext();
    });

    provider.on("networkChanged", async (networkId) => {
      const { web3 } = this.state;
      const chainId = await web3.eth.chainId();
      await this.setState({ chainId, networkId });
      this.loadNetworkContext();
    });
  };

  getNetwork = () => getChainData(this.state.chainId).network;
  getChainName = () => getChainData(this.state.chainId).name;

  getProviderOptions = () => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: process.env.REACT_APP_INFURA_ID
        }
      },
      fortmatic: {
        package: Fortmatic,
        options: {
          key: process.env.REACT_APP_FORTMATIC_KEY
        }
      },
      authereum: {
        package: Authereum
      },
      unilogin: {
        package: UniLogin
      }
    };
    return providerOptions;
  };

  
  resetApp = async () => {
    const { web3 } = this.state;
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }
    await this.web3Modal.clearCachedProvider();
    this.setState({ ...INITIAL_STATE });
  }  
  
  /////////////////////////////OLD///////////////////////////////////
  

  loadNetworkContext() {
    const { web3, networkId, address } = this.state;
    console.log('Loading Contract...');
    let networkName;
    let contractAddress;
    switch (networkId) {
      case 1:
        networkName='mainnet';
        contractAddress='0x5a7901d2c9C52C7149F9D4dA35f92242eB5d9992';
        break;
      case 3:
        networkName='ropsten';
        break;
      case 4:
        networkName='rinkeby';
        contractAddress='0xF3aE5E81E6469bAD34D429b2E8b94cc07Bee32ee';
        break;
      default:
        console.log('This is an unknown network.');
        break;
    }
    
    var notarizer = new web3.eth.Contract(NotarizerAbi, contractAddress);      

    let documentNotarizedEvent = notarizer.events.DocumentNotarized();
    documentNotarizedEvent.on('data', (event) => {
      console.log('we did get the event for a document having nbeen nortrized', event);

      if (event.returnValues.from === address) {
        web3.eth.getBlock(event.blockNumber).then((block) => {
          this.setState({
            waitingForBlockchain: false,
            canFileBeHashed: false,
            currentStatus: 'Document-Hash has been successfully stored on the blockchain!',
            blockInfo: {
              mineTime: block.timestamp
            }
          });
          
        });
      }
    });

    console.log('setting contract in state ', notarizer);
    this.setState({
      notarizer,
      networkName,
      chainName: this.getChainName()
    });
    
  }  

  handleDropzoneChange(files) {
    console.log(files);

    if (files.length === 1) {
      this.setState({
        file: files[0]
      });
      setTimeout(() => {
        this.performFileCheck();
      }, 0);
    } else {
      this.setState({
        canFileBeHashed: false        
      });      
    }
  }

  async getByHash(sha256Hash) {
    return this.state.notarizer.methods.getByHash('0x'+ sha256Hash).call();
  }

  handleFileSubmit(event) {
    event.preventDefault();

    const { address, web3, networkId } = this.state;

    this.state.file.arrayBuffer().then((buffer) => {
      let sha256Hash = sha256(buffer);
      console.log('this my buffer ', sha256Hash);

      this.getByHash(sha256Hash).then( (result) => {
        console.log('Got back from the chain: ', result);
        if (parseInt(result[0]) > 0) {
          alert('this document has already been hashed on the blockchain');
        } else {
          this.setState({
            waitingForBlockchain: true,
            currentStatus: 'Please wait while the hashcode is being mined into the blockchain. This can take a few minutes.'
          });
          this.state.notarizer.methods.notarize('0x' + sha256Hash).send({from: address}).then( (result) => {
            console.log('this is our result ', result);
          });
        }
      });
    });
  }

  handleFileCheck(event) {
    event.preventDefault();
    this.performFileCheck();
  }

  performFileCheck() {
    this.state.file.arrayBuffer().then((buffer) => {
      let sha256Hash = sha256(buffer);
      console.log('this my buffer ', sha256Hash);

      this.getByHash(sha256Hash).then((result) => {
        console.log('Got back from the chain: ', result);

        if (parseInt(result[0]) > 0) {
          this.setState({
            currentStatus: 'The file has been hashed before.',
            canFileBeHashed: false,
            blockInfo: {
              mineTime: parseInt(result[0]),
              blockNumber: parseInt(result[1])
            }
          });
        } else {
          this.setState({
            currentStatus: 'The file is currently unknown.',
            canFileBeHashed: true,
            blockInfo: false
          });
        }
      });
    });
  }

  handleChange(event) {
    this.setState({
      hashValue: event.target.value
    });
  }

  handleSubmit(event) {
    this.state.notarizer.notarize(this.state.hashValue,
      (error, result) => {
        console.log('this is our result ', result);
      //$("#result").html(result);
      });

    event.preventDefault();
  }


  handleChangeHashLookup(event) {
    this.setState({
      lookupHashValue: event.target.value
    });
  }


  isHashButtonDisabled() {
    return !this.state.canFileBeHashed || this.state.waitingForBlockchain;  
  }


  render() {
    const {classes} = this.props;
    const {
      address,
      connected,
      chainId,
      fetching,
      showModal,
      pendingRequest,
      result,
      chainName,
    } = this.state;
    
    return (
      <React.Fragment>
        <CssBaseline />
        
    <Router>
          <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
            <Toolbar className={classes.toolbar}>
              <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
                documented.me
              </Typography>
              <nav>
                <MatLink variant="button" color="textPrimary" href="#" className={classes.link}>
                  Features
                </MatLink>
                <MatLink variant="button" color="textPrimary" href="#" className={classes.link}>
                  Enterprise
                </MatLink>
                <MatLink variant="button" color="textPrimary" href="#" className={classes.link}>
                  Support
                </MatLink>
              </nav>
              <Button href="#" color="primary" variant="outlined" className={classes.link}>
                Login
              </Button>
            </Toolbar>
          </AppBar>
    
    
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/about">
          'about'
          </Route>
          <Route path="/users">
          'usres'
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
        







          { /* Footer */ }
          <Container maxWidth="md" component="footer" className={classes.footer}>
            <Grid container spacing={4} justify="space-evenly">
              {footers.map((footer) => (
        <Grid item xs={6} sm={3} key={footer.title}>
                  <Typography variant="h6" color="textPrimary" gutterBottom>
                    {footer.title}
                  </Typography>
                  <ul>
                    {footer.description.map((item) => (
          <li key={item}>
                        <MatLink href="#" variant="subtitle1" color="textSecondary">
                          {item}
                        </MatLink>
                      </li>
        ))}
                  </ul>
                </Grid>
      ))}
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </Container>
          { /* End footer */ }

      </React.Fragment>
    );
  }
}

export default withStyles(styles)(App);
