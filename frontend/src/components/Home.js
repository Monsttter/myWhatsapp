import React, { useEffect, useState } from 'react'
import Navbar from './Navbar';
import { useNavigate } from 'react-router';
import ChatBar from './ChatBar';
import SideBar from './SideBar';
import { useDispatch } from 'react-redux';
import { setUser } from '../state/slices/user';
import { fetchUser as fetchUserApi } from '../api/auth';
import socket from '../context/socket';
import { setOfflineUser, setOnlineUser, setOnlineUsers } from '../state/slices/onlineUsers';

const Home = () => {

    const [showChats, setShowChats]= useState(false);
    // const [showChatbar, setShowChatbar]= useState(false);
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

    const navigate= useNavigate();
    const dispatch= useDispatch();

    const fetchUser= async()=>{
        const data= await fetchUserApi();
        dispatch(setUser(data));
    }

    useEffect(()=>{
      if(!localStorage.getItem("token")){
        navigate("/login");
      }
      else{
        socket.auth = { token: localStorage.getItem("token") }; // optional: attach auth info
        socket.on("onlineUser", (data)=>{
          dispatch(setOnlineUser(data));
        })
        socket.on("onlineUsers", (data)=>{
          dispatch(setOnlineUsers(data));
        })
        socket.on("offlineUser", (data)=>{
          dispatch(setOfflineUser(data));
        })
        socket.connect(); // ✅ connect only after login
        fetchUser();
      }
      // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const handleResize = () => {
          setViewportWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        // Clean up the event listener when the component unmounts
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);

  return (
    <div style={{height: "100vh"}}>
      <Navbar />
      <div className="d-flex" style={{height: "92%", color: 'white', width: "100%"}}>
      
        <div id='sidebar' style={{height: "100%", display: viewportWidth < 600 && showChats && "none" ,width: viewportWidth < 600 ? (showChats ? "0%" : "100%" ): "25%", backgroundColor: "#343a40", borderRight: "1px solid black"}}>
          <SideBar setShowChats= {setShowChats}/>
        </div>

        <div id='chatbar' style={{height: "100%", display: viewportWidth < 600 && !showChats && "none", width: viewportWidth < 600 ? (showChats ? "100%" : "0%" ): "75%" , backgroundColor: "#495057"}}>
          { showChats ? <ChatBar viewportWidth= {viewportWidth} setShowChats= {setShowChats} /> : 
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
