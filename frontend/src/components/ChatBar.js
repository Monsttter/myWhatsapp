import React, { useContext, useEffect, useRef, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import { useSelector } from 'react-redux';
import { SocketContext } from '../context/socketContext';

const ChatBar = () => {

    const user= useSelector(state => state.user);
    // const friend= useSelector(state => state.friend);
    const conversation= useSelector(state => state.conversation);
    const onlineUsers= useSelector(state => state.onlineUsers);

    const [messages, setMessages]= useState([]);
    const [message, setMessage]= useState({text: "", file: null});
    const [fileArea, setFileArea]= useState(false);
    const [name, setName]= useState("");
    const [reciever, setReciever]= useState(false);

    const messagesRef= useRef();
    const fileRef= useRef();
    const socket = useContext(SocketContext);

    const fetchMessages= async()=>{
      const response= await fetch(`https://mywhatsapp-ymha.onrender.com/api/messages/fetchmessages/${conversation._id}`,{
        method: "GET",
        headers: {
          "auth-token": localStorage.getItem("token")
        }
      });
      const data= await response.json();
      // console.log(data);
      setMessages(data.messages.reverse());
    }

    useEffect(()=>{
      if(conversation){
        setReciever(null);
        fetchMessages();
        if(conversation.isGroup){
          setName(conversation.groupName);
        }
        else{
          const reciever= conversation.participants.find(participant => participant._id !== user._id);
          // console.log(reciever);
          setReciever(reciever);
          setName(reciever.username);
        }
      }
      if(socket){
        socket.on("message", (msg)=>{
          const data= JSON.parse(msg);
          console.log(data);
          if(conversation._id === data.conversation._id)
          setMessages([data.newMessage, ...messagesRef.current]);
        })
      }
      // eslint-disable-next-line
    },[conversation])

    useEffect(()=>{
        messagesRef.current= messages;
    }, [messages])

    const handleSubmit= async(e)=>{
      e.preventDefault();
      console.log(message);
      let fileData= null; 
      if(message.file){
        const formData= new FormData();
        formData.append("file", message.file);
        const response= await fetch(`https://mywhatsapp-ymha.onrender.com/api/messages/saveFile`,{
          method: "POST",
          headers: {
            "auth-token": localStorage.getItem("token")
          },
          body: formData
        });
        fileData= await response.json();
      }
      socket.emit("message", JSON.stringify({message: {text: message.text, file: fileData}, conversationId: conversation._id}));
      setMessage({text: "", file: null});
      setFileArea(false);
    }

    const handleChange= (e)=>{
      if(e.target.files){
        setMessage({...message, file: e.target.files[0]});
        setFileArea(true);
      }
      else{
        setMessage({...message, text: e.target.value});
      }
    }

    const getTime= (timestamp)=>{
      const date= new Date(timestamp);
      let time= "" + date.getHours()%12 + ":" + date.getMinutes() + (date.getHours()>=12 ? " PM" : " AM");
      return time;
    }

    const getDay= (timestamp)=>{
      const date= new Date(timestamp);
      // console.log(date.toDateString());
      return date.toDateString();
    }

    const addPersonInGroup= async()=>{
      const email= prompt("Enter email you want to add:");
      await fetch(`https://mywhatsapp-ymha.onrender.com/api/messages/addperson/${conversation._id}`, {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("token"),
          "content-type": "application/json"
        },
        body: JSON.stringify({email})
      })
    }

  return (
    <div className="">
      
      <div className="d-flex align-items-center" style={{borderBottom: "1px black solid", height: "10vh", cursor: "pointer", padding: "8px 20px", backgroundColor: "#343a40"}}>
             <Avatar alt="Remy Sharp" style={{width: "40px", height: "40px"}} src={`http://localhost:5000/profilePhotos/${reciever && reciever.photo.filename}`} /> 
             <h4 className="p-2">{name}</h4>
             {conversation.isGroup && <button className="btn ms-auto" style={{backgroundColor: "darkgrey"}} onClick={addPersonInGroup}>Add people</button>}
             {!conversation.isGroup && <div className="" style={{color: reciever && onlineUsers.includes(reciever._id) ? "green" : "grey"}}>●</div>}
             
      </div>

      {fileArea ? <div style={{height: "76vh", backgroundColor: "#fbfafa54"}}>
        <img style={{height: "200px", margin: "120px auto"}} src={URL.createObjectURL(message.file)} alt="" />
      </div> :

      <div style={{maxHeight: "75vh", overflow: "auto", display: "flex", flexDirection: "column-reverse", paddingBottom: "10px"}}>
          {messages.map((currentMessage, index) =>{
            return <div key={currentMessage._id}>
            {(index===messages.length-1 || getDay(currentMessage.timestamp)!==getDay(messages[index+1].timestamp)) && <div className="m-3" style={{ textAlign: "center"}}> <span className="p-1" style={{border: "1px solid grey", color:"darkgrey", borderRadius: "5px"}}> {getDay(currentMessage.timestamp)} </span></div> }
            <div className="" style={{ margin: "0px 0px", padding: "4px 40px"}}>

              <div style={{float: user._id===currentMessage.sender._id ? "right" : "left"}}>
                { <div style={{ display: "flex", flexDirection: "column", backgroundColor: user._id===currentMessage.sender._id ? "#1d6160" : "#343a40", padding:"5px", borderRadius: "5px", maxWidth:"60vw", overflowWrap: "break-word"}}>
                  {conversation.isGroup && <p style={{textAlign: "left", margin: "0", color: "lightblue"}}>{user._id!==currentMessage.sender._id && currentMessage.sender.username}</p> }
                  {currentMessage.type === "image" && <img style={{display: "block", height: "200px", borderRadius: "10px"}} src={`http://localhost:5000/files/${currentMessage.file.filename}`} alt="" />}
                  {/* {currentMessage.type === "file" && <iframe src={`http://localhost:5000/files/${currentMessage.file.filename}`} frameborder="0"></iframe> } */}
                  
                  {/* {currentMessage.type === "file" && <Document file={`http://localhost:5000/files/${currentMessage.file.filename}`}><Page /></Document>} */}
                  
                  {/* {currentMessage.type === "file" && <ReactPDF file={{    url: 'http://www.example.com/sample.pdf'}}/>} */}
                  
                  <p style={{textAlign: "left", margin: "0 60px 0 0"}}>
                    {currentMessage.text}
                  </p>
                  <sub style={{marginTop: "auto", bottom: "5px",  alignSelf: "flex-end", whiteSpace: "nowrap"}}>{getTime(currentMessage.timestamp)}</sub>
                </div> }
    
              </div>

            </div>
            </div>
          })}
      </div>
      }

      <form className="d-flex" onSubmit={handleSubmit} style={{position: "absolute", bottom: "0", height: "6vh", width: "80vw", }}>
        <input autoFocus className="p-2 flex-grow-1" type="text" name="message" id="message" value={message.text} onChange={handleChange} style={{color: "white", outline: "none", backgroundColor: "#343a40", height: "100%", border: "none", borderTop: "none", width: "100%", margin: "0 0"}}/>
        <ImageIcon sx={{height: "6vh", width: "40px", backgroundColor: "#343a40", paddingRight: "10px", borderRight: "1px solid black", cursor: "pointer"}} onClick={()=>{fileRef.current.click()}}/>
        <input ref={fileRef} onChange={handleChange} style={{display: "none"}} type="file" accept="image/*,.gif,.pdf" name="file" id="file"/>
        <button className="p-1" type="submit" style={{border: "none", minWidth: "3vw", backgroundColor: "#343a40", color: "white"}}><SendIcon/></button>
      </form>
    </div>
  )
}

export default ChatBar
