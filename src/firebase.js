import * as firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/analytics'
import 'firebase/storage'

var firebaseConfig = {
    apiKey: "AIzaSyDDpDcCMmJsO1SGfPwaG8jtuucGJXt-ZuA",
    authDomain: "toaadmin-3e19f.firebaseapp.com",
    databaseURL: "https://toaadmin-3e19f.firebaseio.com",
    projectId: "toaadmin-3e19f",
    storageBucket: "toaadmin-3e19f.appspot.com",
    messagingSenderId: "966226002863",
    appId: "1:966226002863:web:e3daa150b282c272bd255a",
    measurementId: "G-KVY9MQ3HHZ"
  };

export const fire= firebase.initializeApp(firebaseConfig)
firebase.analytics()
export const db= firebase.firestore()
export const auth= firebase.auth()
export const storage= firebase.storage()