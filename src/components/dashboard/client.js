import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {auth, db, storage} from '../../firebase'
import {useParams} from 'react-router'
import * as firebase from 'firebase'

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function Client() {

  const [newHeader, setNewHeader]= useState({
    name: null,
    interests: null,
    mail: null,
    phone: null
  })

  const [header, setHeader]= useState({
    name: null,
    addedOn: null,
    interests: null,
    sessions: null,
    sessionsDone: null,
    mail: null,
    phone: null
  })
  const [notes, setNotes]= useState(null)
  const [status, setStatus]= useState(null)
  const [url, setUrl]= useState(null)
  const [date, setDate]= useState(null)
  const [specialNote, setSpecialNote]= useState(null)
  const [touchpoints, setTouchpoints]= useState()
  const {lid}= useParams()

  useEffect(()=>{
    if(lid)
    {db.collection('Clients').doc(lid).get()
      .then(doc=>{
        // interests are stored as a plain string.... change to array later
        if(doc.exists){
          setHeader({
            name: doc.data().name,
            addedOn: doc.data().addedOn,
            interests: doc.data().interests,
            phone: doc.data().phone,
            mail: doc.data().mail,
            sessions: Number(doc.data().sessions),
            sessionsDone: Number(doc.data().sessionsDone),
            caseHistory: doc.data().caseHistory,
            engagement: doc.data().engagement
          })
          setTouchpoints(doc.data().touchpoints)
        }
        else
          alert("This client is no longer available")
      })}
  }, [])

  const editHeader=()=>{
    db.collection('Clients').doc(lid).update({
      name: newHeader.name && newHeader.name.trim()!=""? newHeader.name: header.name,
      mail: newHeader.mail && newHeader.mail.trim()!=""? newHeader.mail: header.mail,
      phone: newHeader.phone && newHeader.phone.trim()!=""? newHeader.phone: header.phone
    }).then(()=>window.location.reload())
  }
  const addTouchpoint=()=>{

    if(notes && date){
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();

      today = dd + '/' + mm + '/' + yyyy;

      
      db.collection('Clients').doc(lid).update({      
        sessionsDone: status=="Consultancy Call"? header.sessionsDone+1: header.sessionsDone ,      
        touchpoints: firebase.firestore.FieldValue.arrayUnion({
          timeStamp: today,
          date: date,
          recording: url,
          notes: notes,
          type: status
        }),
        caseHistory: specialNote && specialNote.trim()!=""? firebase.firestore.FieldValue.arrayUnion(specialNote) : header.caseHistory
      }).then(()=> window.location.reload())
      
      }
      else{
        alert("notes and recording files can not be empty")
      }
    }
    
  
  const addFile=(e)=>{
    var file= e.target.files[0]
    var storageRef= storage.ref('recordings/'+file.name)
    storageRef.put(file).then(()=> {
      alert("you can now submit your touchpoint")
      storageRef.getDownloadURL()
        .then(url=> setUrl({url}))
        .catch(err=> console.log(err))
    })
    .catch(err=> console.log(err))

  }
  const deleteLead=()=>{
    db.collection('Clients').doc(lid).delete()
      .then(()=>{window.location.reload()})
      .catch(err=>console.error(err))
  }

  const deleteTp=(index)=>{
   
    var temp=[]
    console.log(temp)
    var ref= db.collection('Clients').doc(lid)
    ref.get()
      .then(doc=>{
        temp=doc.data().touchpoints 
        temp.splice(index, index)
        ref.update({
          touchpoints: temp
        }).then(()=>window.location.reload())
          .catch(e=>console.error(e))
      })
  }
  
  
  const classes = useStyles();
  return (
    <div style={{marginLeft: '2em', marginBottom:'3em'}}>
        <h2>Name: {header.name} </h2>
        <h2>Added on: {header.addedOn} </h2>
        <h2>No. of Sessions: {header.sessions} </h2>
        <h2>Sessions Left: {header.sessions-header.sessionsDone} </h2>
        <h2>Interests: {header.interests} </h2>
        <h2>mail: {header.mail} </h2>
        <h2>phone: {header.phone} </h2>
        <h2>engagement period: {header.engagement} </h2>
        <h2>Case History:</h2>
        <p style={{marginLeft:'3em', fontSize: '1.3em'}}>
          {header.caseHistory? header.caseHistory.map(ch=><li>{ch}</li>):"nothing added yet"}
        </p>
        <br />
        <button onClick={deleteLead} >Delete Client</button>
        <br />

    <React.Fragment>
      
      <Table size="small" style={{marginBottom:'2em'}}>
        <TableHead>
          <TableRow>
            <TableCell>Time Stamp</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Notes</TableCell>
            <TableCell> Recording</TableCell>
            <TableCell> Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {touchpoints? touchpoints.map((row, index) => (
            <TableRow >
              <TableCell>{row.timeStamp}</TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>{row.notes}</TableCell>
              <TableCell><a href={row.recording? row.recording.url: null} target='blank' >Recording</a></TableCell>
              <TableCell><button onClick={()=>{deleteTp(index)}} >Delete</button></TableCell>
            </TableRow>
          )): null}
        </TableBody>
      </Table>

      <lable htmlFor='notes'>Notes</lable><br />
      <textarea style={{width: '80%', height: '20em'}} name='notes' onBlur={(e)=>{setNotes(e.target.value)}}  /><br /><br />

      <lable htmlFor='case_history'>Add to Case History </lable><br />
      <input type='text' name='case_history' style={{width: '80%'}} onBlur={(e)=>{setSpecialNote(e.target.value)}} /><br /><br />

      <lable htmlFor='date'>Date</lable><br />
      <input type="date" name='date' onChange={(e)=>{setDate(e.target.value)}}  /><br /><br />

      <lable htmlFor='recording'>Recording</lable><br />
      <input type='file' name='recording' onChange={addFile} /><br /><br />
   
        <select onChange={(e)=>{setStatus(e.target.value)}} >
          <option default selected>--Touchpoint Type--</option>
          <option value="Consultancy Call">Consultancy Call</option>
          <option value="Accountability Call">Accountability Call</option>          
        </select><br /><br />
        <button type='button' onClick={addTouchpoint}>Add Touchpoint</button><br /><br /><br /><br />
        <h2>Edit Info</h2><br />
        <lable htmlFor='new_name'>Name </lable><br />
        <input type='text' name='new_name' style={{width: '80%'}} onBlur={(e)=>{setNewHeader({ ...newHeader,  name:e.target.value})}} /><br /><br />

        <lable htmlFor='new_mail'>Email </lable><br />
        <input type='email' name='new_mail' style={{width: '80%'}} onBlur={(e)=>{setNewHeader({ ...newHeader,  mail:e.target.value})}} /><br /><br />

        <lable htmlFor='new_phone'>Phone </lable><br />
        <input type='text' name='new_phone' style={{width: '80%'}} onBlur={(e)=>{setNewHeader({ ...newHeader,  phone:e.target.value})}} /><br /><br />
        <button type='button' onClick={editHeader}>Edit</button><br /><br /><br /><br />

    </React.Fragment>
    </div>
  );
}