import React, { useEffect, useState } from 'react'
import Navbar from './Navbar';
import { useNavigate } from 'react-router';
import ChatBar from './ChatBar';
import SideBar from './SideBar';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../state/slices/user';
import socket from '../context/socket';

const Home = () => {

    const [showChats, setShowChats]= useState(false);

    const navigate= useNavigate();
    const dispatch= useDispatch();

    const fetchUser= async()=>{
        const response= await fetch("http://localhost:5000/api/auth/fetchuser",{
            headers:{
                "auth-token": localStorage.getItem("token")
            }
        });
        const data= await response.json();
        dispatch(setUser(data));
    }

    useEffect(()=>{
      if(!localStorage.getItem("token")){
        navigate("/login");
      }
      else{
        fetchUser();
        socket.auth = { token: localStorage.getItem("token") }; // optional: attach auth info
        socket.connect(); // ✅ connect only after login
      }
      // eslint-disable-next-line
    }, []);

  return (
    <div>
      <Navbar />
      <div className="d-flex" style={{height: "92vh", color: 'white'}}>
      
        <div style={{width: "20vw", backgroundColor: "#343a40", borderRight: "1px solid black"}}>
          <SideBar setShowChats= {setShowChats}/>
        </div>

        <div style={{height: "100%", width: "80vw", backgroundColor: "#495057"}}>
          { showChats ? <ChatBar /> : 
            <div className="text-align-center" style={{padding: "200px"}}>
              <h3>Welcom to myWhatsApp</h3>
              <p>Send and recieve messages</p>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default Home
