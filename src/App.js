import React from 'react';
import './App.css';
import { getWeb3 } from './eth/network';
import NotarizerAbi from './eth/notarizer-abi';
import { sha256 } from 'js-sha256';

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
import Link from '@material-ui/core/Link';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';

import { DropzoneArea } from 'material-ui-dropzone'


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
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




class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hashValue: '',
      lastResult: '---',
      canFileBeHashed: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeHashLookup = this.handleChangeHashLookup.bind(this);
    this.handleSubmitHashLookup = this.handleSubmitHashLookup.bind(this);

    this.handleFileSubmit = this.handleFileSubmit.bind(this);
    this.handleFileCheck = this.handleFileCheck.bind(this);
    this.fileInput = React.createRef();

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

  handleFileSubmit(event) {
    event.preventDefault();

    this.state.file.arrayBuffer().then((buffer) => {
      let sha256Hash = sha256(buffer);
      console.log('this my buffer ', sha256Hash);

      this.state.notarizer.getByHash(sha256Hash, (error, result) => {
        if (!error) {
          console.log('Got back from the chain: ', result);
          if (parseInt(result[0]) > 0) {
            alert('this document has already been hashed on the blockchain');
          } else {
            this.setState({waitingForBlockchain: true});
            this.state.notarizer.notarize(sha256Hash, (error, result) => {
              console.log('this is our result ', result);
              //$("#result").html(result);
            });
          }
        } else
          console.error(error);
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

      this.state.notarizer.getByHash(sha256Hash, (error, result) => {
        if (!error) {
          if (parseInt(result[0]) > 0) {
            this.setState({
              lastResult: 'The file has been hashed before.',
              canFileBeHashed: false,
            });
          } else {
            this.setState({
              lastResult: 'The file is currently unknown.',
              canFileBeHashed: true,
            });
          }
          console.log('Got back from the chain: ', result.toString());
        } else
          console.error(error);
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

  handleSubmitHashLookup() {
    this.state.notarizer.getByHash(this.state.lookupHashValue,
      (error, result) => {
        if (!error) {
          console.log('FOUND: ', result.toString());
        } else
          console.error(error);
      });

    event.preventDefault();
  }


  async componentDidMount() {
    console.log('COMPONENT DID MOUTN yeah');
    console.log('this is my web3:', getWeb3());
    console.log('tjhis is my ABI: ', NotarizerAbi);


    let contract = getWeb3().eth.contract(NotarizerAbi);
    let notarizer = contract.at('0xF3aE5E81E6469bAD34D429b2E8b94cc07Bee32ee');

    let documentNotarizedEvent = notarizer.DocumentNotarized();

    this.setState({
      notarizer,
      documentNotarizedEvent
    });

    documentNotarizedEvent.watch((error,result) => {
      if (!error) {
        if (result.args.from === getWeb3().eth.defaultAccount) {
          this.setState({waitingForBlockchain: false});
          console.log('we did get the event for the document having nbeen nortrized', result);
        }
      } else {
        console.log('There was an error in the event callback', error );
      }
      
    });
  }

  isHashButtonDisabled() {
    return !this.state.canFileBeHashed || this.state.waitingForBlockchain;  
  }
  
  render() {
    const {classes} = this.props;
    return (
      <React.Fragment>
        <CssBaseline />
          <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
            <Toolbar className={classes.toolbar}>
              <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
                Company name
              </Typography>
              <nav>
                <Link variant="button" color="textPrimary" href="#" className={classes.link}>
                  Features
                </Link>
                <Link variant="button" color="textPrimary" href="#" className={classes.link}>
                  Enterprise
                </Link>
                <Link variant="button" color="textPrimary" href="#" className={classes.link}>
                  Support
                </Link>
              </nav>
              <Button href="#" color="primary" variant="outlined" className={classes.link}>
                Login
              </Button>
            </Toolbar>
          </AppBar>

          { /* Hero unit */ }
          <Container maxWidth="sm" component="main" className={classes.heroContent}>
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              Pricing
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" component="p">
              Quickly build an effective pricing table for your potential customers with this layout.
              It's built with default Material-UI components with little customization.
            </Typography>

          </Container>
          { /* End hero unit */ }

          <Container maxWidth="sm" component="main" className={classes.mainContent}>
            <DropzoneArea filesLimit={1}
            dropzoneClass={classes.dropZone}
            showPreviews={false}
            showPreviewsInDropzone={false}
            showAlerts={false}
            onChange={this.handleDropzoneChange.bind(this)}
            />
          </Container>


          <Container maxWidth="sm" component="main" className={classes.mainContent} >
            <Paper elevation={0} className={classes.resultContent}>
            {
              this.state.file ? 
              'Selected File: ' + this.state.file.name
              :
              'No file selected'
            }
            <br/>
            
            {this.state.lastResult}

            </Paper>

          </Container>

          <Container maxWidth="sm" component="main" className={classes.mainContent} 
            style={{textAlign: 'center'}}>
            <Button variant="contained" color="primary" disabled={this.isHashButtonDisabled()} onClick={this.handleFileSubmit.bind(this)}>
              Submit Hash
            </Button>

          </Container>


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
                        <Link href="#" variant="subtitle1" color="textSecondary">
                          {item}
                        </Link>
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


        <div className="container">
            <h1>Document Notarizer</h1>
            <label className="col-lg-2 control-label">
            Document to notarize
            </label>
            <input type="text" onChange={this.handleChange}/>
            <button onClick={this.handleSubmit}>Notarize</button>        
            
            
            <label className="col-lg-2 control-label">
            Check Document
            </label>
            <input type="text" onChange={this.handleChangeHashLookup}/>
            <button onClick={this.handleSubmitHashLookup}>Check</button>        
            <label className="col-lg-2 control-label">Status</label>
            <h2 id="result"></h2>
            
            <hr/>
            
            <form >
              <label>
                Upload file:
                <input type="file" ref={this.fileInput} />
              </label>
              <br />
              <button type="button" onClick={this.handleFileSubmit.bind(this)}>Submit Hash</button>
              <button type="button" onClick={this.handleFileCheck.bind(this)}>Check Hash</button>
            </form>          
            
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(App);
