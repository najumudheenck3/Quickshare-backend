import mongoose, { Schema, Document } from "mongoose";

export  interface AddPost extends Document{
    userId:mongoose.Types.ObjectId;
    descripcion: string;
    img: string[];
    shorts:string;
    likes: string[];
    isActive:boolean;
}

const postSchema:Schema=new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      descripcion:{
        type: String,
    },
    img: [{
        type: String,
        default:null
    }],
    shorts:{
        type: String,
        default:null
    },
    likes:[{
        type: String
    }],
    isActive:{
        type:Boolean,
        default:true
    }
},{
    timestamps: true,
})

export default mongoose.model<AddPost>("post",postSchema );