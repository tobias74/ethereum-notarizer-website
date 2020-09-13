import React from 'react';
import './App.css';




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

import ResponsiveAppBar from './components/ResponsiveAppBar';
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







class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }






  render() {
    const {classes} = this.props;
    const {
      
    } = this.state;
    
    return (
      <React.Fragment>
        <CssBaseline />
        
          <Router>
            <ResponsiveAppBar/>
    
            <Switch>
              <Route path="/about">
              'about'
              </Route>
              <Route path="/privacy">
              'privacy'
              </Route>
              <Route path="/imprint">
              'imprint'
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
  
          </Router>

          { /* Footer */ }
          <Container maxWidth="md" component="footer" className={classes.footer}>
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
