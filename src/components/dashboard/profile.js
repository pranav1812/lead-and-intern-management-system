import React, {useEffect, useState} from 'react'
import {auth, db} from '../../firebase'
import {useParams} from 'react-router'

export default function Profile() {

    const {uid}= useParams()
    const [name, setname]= useState(null)
    const [start, setStart]= useState(null)
    const [end, setEnd]= useState(null)
    const [nLeads, setNLeads]= useState(null)  
    
    useEffect(()=>{
        db.collection('Interns').doc(uid).get()
            .then(doc=>{
                if(doc.exists){
                    setname(doc.data().name)
                    setStart(doc.data().joinedOn)
                    setEnd(doc.data().endsOn)
                }else{
                    alert("profile not found")
                }

            })
            .catch(err=>{alert("some error occured profile information")})

        db.collection('Leads').where("handler", "==", uid).get()
            .then(snapShots=>{
                var temp=0
                snapShots.forEach(doc=> temp++)
                setNLeads(temp)
            })
            .catch(err=> console.error(err))
    }, [])
    return (
        <div>
            <h2>Name: {name}</h2>
            <h2>Joined On: {start}</h2>
            <h2>Contract Ends on: {end}</h2>
            <h2>No. of Leads handling: {nLeads? nLeads: 0}</h2>
        </div>
    )
}
