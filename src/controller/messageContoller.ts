import { Request, Response } from "express";
import messageModel from "../model/messageModel";

//add

export const addMessage=async(req: Request, res: Response)=>{
    const newMessage=new messageModel(req.body)
    try {
        const saveMessage=await newMessage.save()
        res.json({saveMessage,message:"new message saved successfully",success:true})  

    } catch (error) {
        console.log(error);
    }
}

//get

export const getMessage=async(req: Request, res: Response)=>{
    try {
        const allMessages=await messageModel.find({
            coversationId:req.params.conversationId
        })
        res.json({allMessages,message:"all messages fetched successfully",success:true})  
    } catch (error) {
        console.log(error);
    }
}