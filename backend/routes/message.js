import express from "express";
import fetchUser from "../middleware/fetchUser.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import multer  from "multer";
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import User from "../models/User.js";
import upload from "../upload.js";
const __dirname = dirname(fileURLToPath(import.meta.url));

// const upload = multer({ dest: path.join(__dirname, "..", "public/files/") });
const router= express.Router();

// Route 1: Create a conversation using POST: "/createconversation". Authentication required
router.post("/createconversation", fetchUser, async(req, res)=>{

    try {
        const user= await User.findOne({email: req.body.email});
        const participants= [req.user.id, user._id];
        let newConversation= new Conversation({
            participants: participants
        });
        newConversation= await newConversation.save();
        newConversation= await Conversation.findById(newConversation._id).populate("lastMessage").populate("participants", "username photo")
        // newConversation= await newConversation.populate("lastMessage").populate("participants", "username photo")
        res.send(newConversation);
    } catch (error) {
        console.log(error);
        res.status(404).send("Internal Error Occured");
    }
})

// Route 2: Create a group using POST: "/creategroup". Authentication required
router.post("/creategroup", fetchUser, async(req, res)=>{

    try {
        let conversation= await Conversation.findOne({groupName: req.body.groupName});
        if(conversation){
            res.status(400).send("A group already exists with this name!");
        }
        const newConversation= await Conversation.create({
            isGroup: true,
            groupName: req.body.groupName,
            groupAdmin: req.user.id,
            participants: [req.user.id]
        })
        res.send(newConversation);
    } catch (error) {
        console.log(error);
        res.status(404).send("Internal Error Occured");
    }
})

// Route 3: Add a user in the group using POST: "/addperson". Authentication required
router.post("/addperson/:conversationId", fetchUser, async(req, res)=>{

    try {
        console.log(req.params.conversationId, req.body.email);
        const user= await User.findOne({email: req.body.email});
        if(user){
            await Conversation.findByIdAndUpdate(req.params.conversationId, {$push: {participants: user._id}});
        }
    } catch (error) {
        console.log(error);
        res.status(404).send("Internal Error Occured");
    }
})

// Route 3: Fetch all messages using GET : "/fetchmessages/:recieverId". Authentication required
router.get("/fetchmessages/:conversationId", fetchUser, async(req, res)=>{

    try {
        const messages= await Message.find({conversationId: req.params.conversationId}).populate("sender", "username photo");
        res.send({messages});
    } catch (error) {
        console.log(error);
        res.status(404).send("Internal Error Occured");
    }
})

// Route 4: Post file using POST : "/saveFile". Authentication required
router.post("/saveFile", fetchUser, upload.single("file"),async(req, res)=>{

    try {
        // console.log(req.file);
        res.json({
            filename: req.file.filename,
            originalname: req.file.originalname,
            path: req.file.path,
            mimetype: req.file.mimetype,
            size: req.file.size,
        })
    } catch (error) {
        console.log(error);
        res.status(404).send("Internal Error Occured");
    }
})


export default router;