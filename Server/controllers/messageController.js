import message from "../models/message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";



//get all users expect the logges in user


export const getUserForSidebar =async (req,res)=>{

    try{
        const userId =req.user._id
        const filteredUser =await User.find({_id:{$ne:userId}}).select("-password")

   //count number of message not seen
   const unseenMessages ={}
   const Promises =filteredUser.map(async (user)=>{
    const messages = await message.find({senderId:user._id,receiverId:userId,seen: false})

    if(messages.length>0){
        unseenMessages[user._id]=messages.length;
    }
   })
   await Promise.all(Promises);
   res.json({success:true,users:filteredUser,unseenMessages})
   
} catch(error){
    console.log(error.message);

    res.json({ success: false, message : error. message})

}
}
//get all message for selected user

export const getMessages = async(req,res)=>{
    try{
        const {id:selectedUserId}=req.params;
        const myId= req.user._id;


        const messages = await message.find({
            $or:[
                {senderId:myId,receiverId:selectedUserId},
                {senderId: selectedUserId, receiverId:myId}
            ]
        }) 
        await message.updateMany({senderId:selectedUserId, receiverId: myId},
            {seen:true});

          res.json({success:true,messages})  
        
    }catch(error){
        console.log(error.message);
    
        res.json({success: false,  message : error. message})
        
    }
}

//api to mark msg as seen using message  id

      export const markMessageAsSeen = async (req,res)=>{
        try{
            const { id} =req.params;
            await message.findByAndUpdate(id, {seen: true})
            res.json({success:true})
        } catch (error){
            console.log(error.message);
            res.json({success: false, message:error.message})
        }
      }

//send message to select user
export const sendMessage = async (req,res)=>{
    try{
        const {text,image}= req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;
          let imageUrl;
          if(image){
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;
         }
         const newMessage = await message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
         })
        
       res.json({success:true,newMessage});

    } catch(error){

        console.log(error.message);
    
        res.json({success: false , message : error.message})

    }
}