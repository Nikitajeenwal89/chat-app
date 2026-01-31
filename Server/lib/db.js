import mongoose from "mongoose";
//function to connect to the database

export const connectDB =async ()=>{

    try{
        mongoose.connection.on('connected',()=>console.log('Database connect'));
        
        await mongoose.connect(`${process.env.MONGO_URI}/chat-app`)
    } catch(error){
        console.log(error);

    }
}