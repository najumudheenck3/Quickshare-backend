import mongoose, { Schema, Document } from "mongoose";

export interface Report extends Document {
  PostId: mongoose.Types.ObjectId;
  userText:[{
    userId:mongoose.Types.ObjectId,
    text:string
  }]
}

const reportSchema: Schema = new Schema({
  postId: {
    type: Schema.Types.ObjectId,
    ref: "post",
  },
  userText: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      text: {
        type: String,
      },
    },
  ],
});

export default mongoose.model<Report>("report", reportSchema);