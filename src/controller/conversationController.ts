import { Request, Response } from "express";
import conversationModel from "../model/conversationModel";

//new conversation
export const postNewConversation=async(req: Request, res: Response)=>{
    console.log(req.body,'kkkkkkkkk');
    
    const newConversation=new conversationModel({
        members:[req.body.senderId,req.body.recieverId]
    })
    try {
      const savedConversation=await newConversation.save()
      res.json({savedConversation,message:"new conversation",success:true})  
    } catch (error) {
        console.log(error);
    }

}


//get conversation of a user

export const getConversation=async(req: Request, res: Response)=>{
try {
    const conversation=await conversationModel.find({
        members:{$in:[req.params.userId]}
    })
    res.json({conversation,message:"new conversation",success:true})  
} catch (error) {
    console.log(error);
}
}