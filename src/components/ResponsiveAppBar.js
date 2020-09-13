import React, { Component } from 'react';
import {
  AppBar, Toolbar, Typography, List, ListItem,
  withStyles, Grid, SwipeableDrawer
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


const styleSheet = {
  list : {
    width : 200,
  },
  home : {
    color: 'white',
    textDecoration: 'none',
    cursor : "pointer",
  },
  padding : {
    paddingRight : 30,
    fontWeight: 700,
    color: 'white',
    textDecoration: 'none',
    cursor : "pointer",
  },

  sideBarIcon : {
    padding : 0,
    color : "white",
    cursor : "pointer",
  }
}

class ResponsiveAppBar extends Component{
  constructor(props){
    super(props);
    this.state = {drawerActivate:false, drawer:false};
    this.createDrawer = this.createDrawer.bind(this);
    this.destroyDrawer = this.destroyDrawer.bind(this);
  }

  componentWillMount(){
    if(window.innerWidth <= 600){
      this.setState({drawerActivate:true});
    }

    window.addEventListener('resize',()=>{
      if(window.innerWidth <= 600){
        this.setState({drawerActivate:true});
      }
      else{
        this.setState({drawerActivate:false});
      }
    });
  }

  //Small Screens
  createDrawer(){
    const {classes} = this.props;
      
    return (
      <React.Fragment>
        <AppBar position="sticky">
          <Toolbar>
            <Grid container direction = "row" justify = "space-between" alignItems="center">
              <MenuIcon
                className = {this.props.classes.sideBarIcon}
                onClick={()=>{this.setState({drawer:true})}} />

              <Typography color="inherit" variant = "h5">
                <Link className={classes.home} to="/home">
                documented.me
                </Link>
              </Typography>
              <Typography color="inherit" variant = "subtitle2"></Typography>
            </Grid>
          </Toolbar>
        </AppBar>

        <SwipeableDrawer
         open={this.state.drawer}
         onClose={()=>{this.setState({drawer:false})}}
         onOpen={()=>{this.setState({drawer:true})}}>

           <div
             tabIndex={0}
             role="button"
             onClick={()=>{this.setState({drawer:false})}}
             onKeyDown={()=>{this.setState({drawer:false})}}>

            <List className = {this.props.classes.list}>
               <ListItem key = {1} button divider> <Link to="/about">About</Link> </ListItem>
               <ListItem key = {2} button divider> Imprint </ListItem>
               <ListItem key = {3} button divider> Privacy </ListItem>
             </List>

         </div>
       </SwipeableDrawer>
      </React.Fragment>
    );
  }

  //Larger Screens
  destroyDrawer(){
    const {classes} = this.props
    return (
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant = "h5" style={{flexGrow:1}} color="inherit" >
            <Link className={classes.home} to="/home">
            documented.me
            </Link>
          </Typography>
          
          <Link className={classes.padding} to="/about">About</Link>
          <Link className={classes.padding} to="/imprint">Imprint</Link>
          <Link className={classes.padding} to="/privacy">Privacy</Link>

        </Toolbar>
      </AppBar>
    )
  }

  render(){
    return(
      <React.Fragment>
        {this.state.drawerActivate ? this.createDrawer() : this.destroyDrawer()}
      </React.Fragment>
    );
  }
}


export default withStyles(styleSheet)(ResponsiveAppBar);


/*
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


*/