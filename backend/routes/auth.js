import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import fetchUser from "../middleware/fetchUser.js";
import multer from "multer";
import Conversation from "../models/Conversation.js";
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import upload from "../upload.js";
const __dirname = dirname(fileURLToPath(import.meta.url));

// const upload = multer({ dest: path.join(__dirname, "..", "public/profilePhotos/") });

const router= express.Router();
const saltRounds = 10;
const JWT_SECRET= process.env.JWT_SECRET;

// Route 1: Register a user using POST : "/register". No Authentication required
router.post("/register", upload.single('profilePhoto'), async(req, res)=>{
    let success= false;
    try {
        // console.log(req.file);
        // console.log(req.body);
        const user= await User.findOne({email: req.body.email});
        if(user) return res.status(400).send({ success, errror: "Sorry! a user with this email already exist."});

        const hash= await bcrypt.hash(req.body.password, saltRounds);
        let newUser= new User({
            ...req.body, password: hash, photo:{
                filename: req.file.filename,
                originalName: req.file.originalname,
                path: req.file.path,
                mimetype: req.file.mimetype,
                size: req.file.size
            }
        })
        newUser= await newUser.save();
        const preload= {
            user: {
                id: newUser._id
            }
        }
        const token= jwt.sign(preload, JWT_SECRET);
        success= true;
        res.send({success, token});
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Error Occured");
    }
})

// Route 2: Login a user using POST : "/login". No Authentication required
router.post("/login", async(req, res)=>{
    let success= false;
    try {
        // console.log(req.body);
        const user= await User.findOne({email: req.body.email});
        if(!user){
            return res.status(400).send({success, errorType: "email", error: "User with this email doesn't exist"});
        }
        const compare= await bcrypt.compare(req.body.password, user.password);
        if(!compare){
            return res.status(400).send({success, errorType: "password", error: "Please login with correct credentials"});
        }
        const preload= {
            user: {
                id: user._id
            }
        }
        success= true;
        const token= jwt.sign(preload, JWT_SECRET);
        res.send({success, token});
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Error Occured");
    }
})

// Route 3: Fetch user details using GET : "/fetchuser". Authentication required
router.get("/fetchuser", fetchUser,async(req, res)=>{
    try {
        // console.log(req.body);
        const user= await User.findById(req.user.id);
        res.send(user);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Error Occured");
    }
})
// Route 4: Fetch all users using GET : "/fetchallusers". Authentication required
router.get("/fetchallusers", fetchUser, async(req, res)=>{
    try {
        // console.log(req.body);
        let users= await User.find({_id: {$ne: req.user.id}});
        let conversations= await Conversation.find({participants: {$in: req.user.id}}).populate("lastMessage");
        // console.log(users);
        // console.log("rahul");
        res.send({users, conversations});
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Error Occured");
    }
})

// Route 5: Fetch all conversations using GET: "/fetchconversations". Authentication required
router.post("/fetchconversations", fetchUser, async(req, res)=>{

    try {
        const conversations= await Conversation.find({participants: {$in: req.user.id}}).populate("lastMessage").populate("participants", "username photo").sort({updatedAt: -1});
        res.send(conversations);
    } catch (error) {
        console.log(error);
        res.status(404).send("Internal Error Occured");
    }
})

export default router;