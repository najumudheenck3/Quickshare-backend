import mongoose, { Schema, Document } from "mongoose";

export  interface Conversation extends Document{
   members:[]
}

const conversationSchema:Schema=new Schema({
members:{
    type:Array
}
},{
    timestamps: true,
})

export default mongoose.model<Conversation>("conversation",conversationSchema);