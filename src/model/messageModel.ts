import mongoose, { Schema, Document } from "mongoose";

export  interface Message extends Document{
  coversationId:string;
  sender:string;
  text:string;
}

const messageSchema:Schema=new Schema({
    coversationId:{
        type:String
    },
    sender:{
        type:String
    },
    text:{
        type:String
    }
},{
    timestamps: true,
})

export default mongoose.model<Message>("message",messageSchema);