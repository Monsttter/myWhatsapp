import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    photo: {
        filename: { type: String },
        originalName: { type: String },
        path: { type: String },
        mimetype: { type: String },
        size: { type: Number }
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})

const User= mongoose.model("User", userSchema);
export default User;