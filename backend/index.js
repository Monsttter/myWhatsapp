import express from "express";
import connectToMongo from "./db.js";
import 'dotenv/config';
import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/message.js";
import cors from "cors";
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import jwt from "jsonwebtoken";
import Conversation from "./models/Conversation.js";
import Message from "./models/Message.js";
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { error } from "node:console";
const __dirname = dirname(fileURLToPath(import.meta.url));

connectToMongo();

const app= express();
const port= process.env.PORT || 5000;
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // update this to restrict access in production
    methods: ["GET", "POST"]
  }
});
const JWT_SECRET= "Thisismysecret";

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));

app.use("/api/auth",  authRoutes);
app.use("/api/messages",  messageRoutes);

server.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
})

const connectedUsers = new Map();

io.use((socket, next)=>{
  const token= socket.handshake.auth.token;
  // console.log(token);
  if(!token) return next(new Error("Authentication error"));

  const preload= jwt.verify(token, JWT_SECRET);
  if(!preload) return next(new Error("Authentication error"));
  // console.log(preload.user.id);
  connectedUsers.set(preload.user.id, socket.id);

  socket.request.user= preload.user;
  
  socket.broadcast.emit("onlineUser", socket.request.user.id);
  socket.emit("onlineUsers", Array.from(connectedUsers.keys()));
  
  next();
  
})

io.on('connection', async(socket) => {
  console.log('a user connected');

  const conversations= await Conversation.find({participants: {$in: socket.request.user.id}})
  conversations.forEach((conversation)=>{
    if(conversation.isGroup){
      socket.join(conversation.groupName);
    }
  })
  socket.on("message", async(message)=>{
      const data= JSON.parse(message);
      // console.log(data);
      let conversation= await Conversation.findById(data.conversationId);
      let newMessage= new Message({
        conversationId: data.conversationId,
        sender: socket.request.user.id,
        text: data.message.text,
        file: data.message.file,
        type: data.message.file ?  (data.message.file.mimetype.substring(0,5)==="image" ? "image" : "file") : "text"
      });
      newMessage= await newMessage.save();
      newMessage= await Message.findById(newMessage._id).populate("sender", "username photo");
      conversation.lastMessage= newMessage._id;
      conversation.updatedAt= Date.now();
      conversation= (await conversation.save());
      conversation= await Conversation.findById(conversation._id).populate("lastMessage").populate("participants", "username photo");
      socket.emit("message", JSON.stringify({newMessage: newMessage, conversation: conversation}));
      // console.log(conversation);
      if(conversation.isGroup){
        socket.to(conversation.groupName).emit("message", JSON.stringify({newMessage: newMessage, conversation: conversation}));
      }
      else{
        const recieverId= conversation.participants.find(participant => String(participant._id) !== socket.request.user.id)
        if(connectedUsers.get(String(recieverId._id))){
          socket.to(connectedUsers.get(String(recieverId._id))).emit("message", JSON.stringify({newMessage: newMessage, conversation: conversation}));
        }

      }
  });

  // Handle disconnections
  socket.on('disconnect', () => {
      console.log('User disconnected');
      const response= connectedUsers.delete(socket.request.user.id);
      io.emit("offlineUser", socket.request.user.id);
      // console.log(response);
  });
});