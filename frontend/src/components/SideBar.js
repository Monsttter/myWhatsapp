import Avatar from '@mui/material/Avatar';
import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { SocketContext } from '../context/socketContext';
import ImageIcon from '@mui/icons-material/Image';
import { setConversation } from '../state/slices/conversation';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { fetchConversations as fetchConversationsApi } from '../api/auth';
import { createConversation, createGroup as createGroupApi } from '../api/messages';

const SideBar = (props) => {

    const user= useSelector(state => state.user);

    const onlineUsers= useSelector(state => state.onlineUsers);

    const [conversations, setConversations]= useState([]);
    const [searchText, setSearchText]= useState("");

    const dispatch= useDispatch();
    const socket = useContext(SocketContext);

    const fetchConversations= async()=>{
      const data= await fetchConversationsApi();
      // console.log(data);
      setConversations(data);
    }

    useEffect(()=>{
      if(user){
        fetchConversations();
      }
      if(socket && user){

        socket.on("message", (msg)=>{
          const data= JSON.parse(msg);
          // console.log(data);
          if(!user){
            return;
          }
          setConversations((prev)=>{
            // console.log(prev);
            return [data.conversation, ...prev.filter(conversation=> conversation._id !== data.conversation._id)]
          })
        })
      }
      // eslint-disable-next-line
    }, [socket, user])

    const handleClick= (conversation)=>{
      // console.log(conversations);
      props.setShowChats(true);
      dispatch(setConversation(conversation));

    }

    const handleChange= (e)=>{
      setSearchText(e.target.value);
    }

    const addFriend= async()=>{
      const email= prompt("Enter the email:");
      const data= await createConversation(email);
      // console.log(data);
      setConversations([data, ...conversations]);
    }
    const createGroup= async()=>{
      const groupName= prompt("Enter the group name:");
      const data= await createGroupApi(groupName);
      // console.log(data);
      setConversations([data, ...conversations]);
    }

  return (
    <div>
      <div style={{height: "20%"}}>
        <div className="d-flex align-items-baseline">
          <h4 className='' style={{textAlign: "center", padding: "20px 0 0 20px"}}>Chats</h4>
          <div class="dropdown ms-auto">
            <div class="" style={{cursor: "pointer"}}  data-bs-toggle="dropdown" aria-expanded="false">
              <MoreVertIcon />
            </div>
            <ul class="dropdown-menu" style={{cursor: "pointer"}}>
              <li><p class="dropdown-item"   onClick={addFriend}>Add Friend</p></li>
              <li><p class="dropdown-item" onClick={createGroup}>Create Group</p></li>
            </ul>
          </div>
        </div>
        <input className="form-control" onChange={handleChange} value={searchText} style={{width: "80%", margin: "10px auto", backgroundColor: 'lightgray'}} type="search" placeholder="Search" aria-label="Search"/>
      </div>
      <div style={{height: "80%", overflow: "auto", scrollbarWidth: "none"}}>
          {conversations.filter(conversation=> {
        const pattern= searchText.toLowerCase();
        let text="";
        if(conversation.isGroup){
          text= conversation.groupName.toLowerCase();
        }
        else{
          const reciever= conversation.participants.find(participant => participant._id !== user._id);
          text= reciever.username.toLowerCase();
        }
        return text.search(pattern) !== -1 ;
      }).map(conversation => {
        let reciever= null;
        let isOnline= false;
        if(!conversation.isGroup){
          reciever= conversation.participants.find(participant => participant._id !== user._id);
          isOnline= onlineUsers.includes(reciever._id);
        }
            return (
            <div key={conversation._id} className="p-3 d-flex align-items-center" style={{ cursor: "pointer"}} onClick={()=>{handleClick(conversation)}}>
             <Avatar alt="Remy Sharp" style={{width: "50px", height: "50px"}} src={reciever && reciever.photo.path} /> 
             <div className="p-2" style={{textAlign: "left"}}>
              <h5 className="m-0">{conversation.isGroup ? conversation.groupName : reciever.username}</h5>
              <div className="m-0" style={{color: 'lightgrey'}}>{conversation.lastMessage &&  <p>{conversation.lastMessage.file && <ImageIcon/>} {conversation.lastMessage.text.length>0 ? (conversation.lastMessage.text.substring(0, 20) +  (conversation.lastMessage.text.length>20 ? "..." : "")) : "Photo"}</p>}</div>
             </div>
             {!conversation.isGroup && <div className="ms-auto" style={{color: isOnline ? "green" : "grey"}}>●</div>}
            </div>)
            })
          }
          </div>
    </div>
  )
}

export default SideBar
