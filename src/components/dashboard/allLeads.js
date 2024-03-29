import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {db} from '../../firebase'



export default function AllLeads() {
  
  const [name, setName]= useState(null)
  const [interest, setInterest]= useState(null)
  const [leads, setLeads]= useState(null)
  const [handler, setHandler]= useState(null)
  const [mail, setMail]= useState(null)
  const [phone, setPhone]= useState(null)

  const addLead=()=>{
    if(name && interest && mail && phone && handler){

      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      today = dd + '/' + mm + '/' + yyyy;

      db.collection('Leads').add({
        name: name,
        interests: interest,
        handler: handler,
        touchpoints: [],
        addedOn: today
      })

      alert("lead added successfully")
    }else{
      alert("name and interest field are important")
    }
  }

  useEffect(() => {
    db.collection('Leads').get()
      .then(snapshots=>{
        var temp=[]
        snapshots.forEach(doc=>{
          temp.push({...doc.data(), id: doc.id})
        })
        setLeads(temp)
      })
    
  }, [])

  return (
    <React.Fragment>
      
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Added On</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Interests</TableCell>   
            <TableCell>Handler</TableCell>      
          </TableRow>
        </TableHead>
        <TableBody>
          {leads? leads.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.addedOn}</TableCell>
              <TableCell><a href={window.location.protocol + "//" + window.location.host + "/" +'lead/'+row.id} target= 'blank'>{row.name}</a> </TableCell>
              <TableCell>{row.interests}</TableCell>
              <TableCell><a href={window.location.protocol + "//" + window.location.host + "/" +'profile/'+row.handler} target= 'blank'>Show Handler</a> </TableCell>
            </TableRow>
          )): null}
        </TableBody>
      </Table>
     
      <h2>Add New Lead</h2>
      <lable >Name</lable><br />
      <input placeholder="eg. Binod" onBlur={(e)=>{setName(e.target.value)}}  /><br /><br />
      <lable>Interests</lable><br />
      <input type='text' onBlur={e=>{setInterest(e.target.value)}} /><br /><br />
      <lable>handler id</lable><br />
      <input type='text' placeholder="uid of handler" onBlur={e=>{setHandler(e.target.value)}} /><br /><br />
      <lable>Phone</lable><br />
      <input type='text' onBlur={e=>{setPhone(e.target.value)}} /><br /><br />
      <lable>Email</lable><br />
      <input type='email' onBlur={e=>{setMail(e.target.value)}} /><br /><br />
      <button type='button' onClick={addLead}>Add Lead</button><br />
    </React.Fragment>
  );
}