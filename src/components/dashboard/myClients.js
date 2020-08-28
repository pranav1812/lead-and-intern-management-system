import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {useParams} from 'react-router'
import {auth, db, storage} from '../../firebase'


function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function MyClients() {
  const classes = useStyles();
  const [name, setName]= useState(null)
  const [interest, setInterest]= useState(null)
  const [leads, setLeads]= useState(null)
  const [mail, setMail]= useState(null)
  const [phone, setPhone]= useState(null)
  const [url, setUrl]= useState(null)
  const [sessions, setSessions]= useState(null)
  const {uid}= useParams()
  

  const addLead=()=>{
    if(name && url && mail && phone){

      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      today = dd + '/' + mm + '/' + yyyy;

      db.collection('Clients').add({
        name: name,
        interests: interest,
        pdf: url,
        handler: uid,
        touchpoints: [],
        addedOn: today,
        mail: mail,
        phone: phone,
        sessions: sessions,
        sessionsDone: "0"

      }).then(()=>{
        alert("client added")
        window.location.reload()
      })

      
    }else{
      alert("name, pdf, mail and phone are important")
    }
  }

  useEffect(() => {
    db.collection('Clients').where("handler", "==", uid).get()
      .then(snapshots=>{
        var temp=[]
        snapshots.forEach(doc=>{
          temp.push({... doc.data(), id: doc.id})
        })
        setLeads(temp)
      })
    
  }, [])

  const addFile=(e)=>{
    var file= e.target.files[0]
    var storageRef= storage.ref('trainingPDFs/'+file.name)
    storageRef.put(file).then(()=> {
      alert("you can now add your client")
      storageRef.getDownloadURL()
        .then(url=> setUrl({url}))
        .catch(err=> console.log(err))
    })
    .catch(err=> console.log(err))

  }

  return (
    <React.Fragment>
      <h2>Add New Client</h2>
      <lable >Name</lable><br />
      <input placeholder="eg. Binod" onBlur={(e)=>{setName(e.target.value)}}  /><br /><br />
      <lable>Interests</lable><br />
      <input type='text' onBlur={e=>{setInterest(e.target.value)}} /><br /><br />
      <lable>Phone</lable><br />
      <input type='text' onBlur={e=>{setPhone(e.target.value)}} /><br /><br />
      <lable>Email</lable><br />
      <input type='email' onBlur={e=>{setMail(e.target.value)}} /><br /><br />
      <lable>No. of Sessions</lable><br />
      <input type='text' onBlur={e=>{setSessions(e.target.value)}} /><br /><br />
      <lable>Training PDF</lable><br />
      <input type='file' onChange={addFile} /><br /><br />
      <button type='button' onClick={addLead}>Add Client</button><br />
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Added On</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Interests</TableCell>         
               

          </TableRow>
        </TableHead>
        <TableBody>
          {leads? leads.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.addedOn}</TableCell>
              <TableCell><a href={window.location.protocol + "//" + window.location.host + "/" +'client/'+row.id} target= 'blank'>{row.name}</a> </TableCell>
              <TableCell>{row.interests}</TableCell>
              
            </TableRow>
          )): null}
        </TableBody>
      </Table>
     
      
    </React.Fragment>
  );
}