import mongoose, { Mongoose } from "mongoose";
import Conversation from "./Conversation.js";
import User from "./User.js";

const messageSchema= new mongoose.Schema({
    conversationId: {
        type: mongoose.Types.ObjectId,
        ref: Conversation
    },
    sender: {
        type: mongoose.Types.ObjectId,
        ref: User
    },
    text: {
        type: String
    },
    file: {
        filename: { type: String },
        originalName: { type: String },
        path: { type: String },
        mimetype: { type: String },
        size: { type: Number }
    },
    type: {
        type: String,
        enum: ["text", "image", "file"], // You can add "video", "audio", etc.
        default: "text",
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})

const Message= mongoose.model("Message", messageSchema);

export default Message;