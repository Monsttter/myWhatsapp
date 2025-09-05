import mongoose from "mongoose";

const connectToMongo= async()=>{
    await mongoose.connect('mongodb+srv://rahulchoudhary252002_db_user:UL77AeN8C0QbLiNx@mywhatsapp.upzesh2.mongodb.net/?retryWrites=true&w=majority&appName=myWhatsapp');
    console.log("Connected to Mongodb");
}

export default connectToMongo;