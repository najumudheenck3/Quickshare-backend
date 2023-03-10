import mongoose, { Schema, Document } from "mongoose";

export  interface CommentReply extends Document{
    userId:mongoose.Types.ObjectId;
    commentId:mongoose.Types.ObjectId;
    comment: string;
    likes: string[];
}

const commentReplySchema:Schema=new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    commentId:{
        type: Schema.Types.ObjectId,
        ref: "comment",
        required: true,
    },
   
    comment:{
        type:String,
        required:true
    },
    likes:[{
        type: String
    }]
},{
    timestamps: true,
})


export default mongoose.model<CommentReply>("commentReply",commentReplySchema );