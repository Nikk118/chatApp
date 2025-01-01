import {User} from "../models/user.model.js"
import {asyncHandler} from "../utils/asyncHandler.js"

import {apiResponse} from "../utils/apiResponse.js"
import { Message } from "../models/message.model.js"
import { getReceiverSocketId,io } from "../utils/socket.js"



const getUserForSidebar=asyncHandler(async(req,res)=>{
    const loggedIn=req.user._id
    if (!loggedIn) {
        return res.status(401).json({message:"unauthorized"})
       
    }

    const allUsers= await User.find({_id:{$ne:loggedIn}}).select("-password")

    if (!allUsers) {
        return res.status(500).json({message:"someting went wrong"})

    }

    return res.status(200)
        .json(
            new apiResponse(200,allUsers,"all user fetched")
        )

})

const getMessages= asyncHandler(async(req,res)=>{
    const {id:userToChatId}=req.params
    const userId=req.user._id

    if (!userToChatId) {
        return res.status(401).json({message:"user to chat id is missing"})

    }
    if (!userId) {
        return res.status(401).json({message:"unauthorized"})

    }

    const messages= await Message.find({$or:[
        {senderId:userId,receiverId:userToChatId },
        {receiverId:userId,senderId:userToChatId}
    ]})

    if (!messages) {
        return res.status(500).json({message:"something went wrong"})

    }

    return res.status(200)
        .json(
            new apiResponse(200,messages,"all messages are fetched")
        )
})

const sendMessage=asyncHandler(async(req,res)=>{
    const {text}=req.body
   
   
    const {id:receiverId}=req.params
    const senderId=req.user._id

    if (!receiverId) {
        return res.status(401).json({message:"receiver id is missing"})

    }
    if (!text) {
        return res.status(401).json({message:"please provide a message"})

    }

    

    const sent=await Message.create({
        senderId,
        receiverId,
        text,
       
    })

    if (!sent) {
      
      return res.status(500).json({ message:"cannot send message"});

    }
    await sent.save()

    const ReceiverSocketId=getReceiverSocketId(receiverId)
    if (ReceiverSocketId) {
        io.to(ReceiverSocketId).emit("newMessage",sent);
    }

    return res.status(200)
        .json(
            new apiResponse(200,sent,"message sent succesfully")
        )
})

export{
    getUserForSidebar,
    getMessages,
    sendMessage
}