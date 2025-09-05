import mongoose, { mongo } from "mongoose";
import User from "./User.js";

const conversationSchema= new mongoose.Schema({
    isGroup: {
        type: Boolean,
        default: false
    },
    groupName: {
        type: String
    }, // only for groups
    groupAdmin:{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }, // optional for groups
    participants: [{
            type: mongoose.Types.ObjectId,
            ref: User
    }],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        default: null
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

const Conversation= mongoose.model("Conversation", conversationSchema);
export default Conversation;