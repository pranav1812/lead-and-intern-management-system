import React, {useEffect, useState} from 'react';
import Login from './components/signin'
import Dashboard from './components/dashboard/dashboard'
import {auth, db} from './firebase'

function App() {
  const [state, setState]= useState(null)
  useEffect(()=>{
    auth.onAuthStateChanged(user=>{
      if(!user){
        setState('no user')
      }
      else if(!user.emailVerified){
        setState('not-verified')
      }
      else{
        db.collection('Interns').doc(user.uid).get()
          .then(doc=>{
            if(!doc.exists){
              var today = new Date();
              var dd = String(today.getDate()).padStart(2, '0');
              var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
              var yyyy = today.getFullYear();
              today = dd + '/' + mm + '/' + yyyy;
              db.collection('Interns').doc(user.uid).set({
                name: user.displayName,
                joinedOn: today,
                endsOn: null,
                isAdmin: false
              })

              setState('verified')
            }
          })
        
      }
    })
  }, [])
  return (
    <div className="App">
      {
        state=='no user'? (<Login />): state=='not-verified'? (<Login />): (<Dashboard />) 
      }
    </div>
  );
}

export default App;
