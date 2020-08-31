import React, {useState, useEffect} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import {auth} from '../firebase';
import * as firebase from 'firebase'

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://www.taleoface.com/" target='blank' >
        Tale Of Ace
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignInSide() {
  const classes = useStyles();

  const [newUser, togglenewUser]= useState(false)
  const [usr, setUsr]= useState()
  const [mail, setMail]= useState(null)
  const [pass, setPass]= useState(null)
  const [name, setName]= useState(null)

  const toggle=()=>{
      togglenewUser(!newUser)
  }

  useEffect(()=>{
    // alert(auth.currentUser)
    auth.onAuthStateChanged(user=>{
    if(! user){
      console.log("signin/signup")
    }
    else if(!user.emailVerified){
      user.sendEmailVerification().then(function() {
        alert("you need to verify your email 1st, verification mail was sent to your registered email")
      }).catch(function(error) {
        console.log(error)
      });
    }
    else{
      // window.location='http://localhost:3000/dashboard'
      window.location.reload()
    }    
    })    
  }, [])

  const signupEmail=()=>{
    if(mail && pass && name)
    { 
      auth.createUserWithEmailAndPassword(mail, pass).catch((error)=> {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.error(errorCode, errorMessage)
      });   
      auth.onAuthStateChanged(user=>{
        if(user)
        {user.updateProfile({
          displayName: name
        })
        window.location.reload()}
      })
    }else{
      alert("email and password required")
    }
  }

  const googleSignup=()=>{
    var provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then(function(result) {
      var user = result.user;
      
    }).catch(function(error) {
      var errorMessage = error.message;
      console.log(errorMessage)
    });
  }

  const emailLogin=()=>{
    if(mail && pass){
      auth.signInWithEmailAndPassword(mail, pass).catch(function(error) {
        var errorMessage = error.message;
        console.error(errorMessage)
      });
      console.log(auth.currentUser)
      setUsr(auth.currentUser)
       
    }else{
      alert("email and password required")
    }   
  }

  // if user changes from null to something\

  /*--------------------------------*/
  
  // useEffect(() => {
  //   var user=auth.currentUser
  //   // if(user!= null) window.location="youtube.com"
  //   // else if(!user.emailVerified) window.location="github.com"
  // }, [user, newUser])

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {newUser? "Sign Up" : "Sign In"}
          </Typography>
          <form className={classes.form} noValidate>
            {
                newUser?
                    <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Full Name"
                    name="name"
                    autoComplete="name"
                    autoFocus
                    onBlur={(e)=> {setName(e.target.value)}}
                />:null
            }
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"  
                      
              onBlur={(e)=> {setMail(e.target.value)}}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"   
                    
              onBlur={(e)=> {setPass(e.target.value)}}
            />
            
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={newUser? signupEmail: emailLogin}
            >
              { newUser? "Sign Up":"Sign In"}
            </Button>
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}             
              onClick={googleSignup}
            >
              { newUser? "Sign Up with Google":"Sign In with Google"}
            </Button>
            
            <Grid container>
            {
                !newUser? 
                    <Grid item xs>
                        <Link href="#" variant="body2">
                        Forgot password?
                        </Link>
                    </Grid>: null
            }
              
              <Grid item>
                <Link href="#" variant="body2" onClick={toggle}>
                  {!newUser? "Don't have an account? Sign Up": "Already a user? Sign In"}
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}