import mongoose, { Schema, Document } from "mongoose";

export interface TokenVerify extends Document {
  userId:mongoose.Types.ObjectId;
  token:string;
}

const tokenSchema: Schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      token: {
        type: String,
        required: true,
      }
});

// Export the model and return your IUser interface
export default mongoose.model<TokenVerify>("token", tokenSchema);
