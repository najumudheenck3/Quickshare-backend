import mongoose, { Schema, Document } from "mongoose";


export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  private: boolean;
  password: string;
  phoneNumber: string;
  verified: boolean;
  isActive: boolean;
  dob: Date;
  address: string;
  city: string;
  country: string;
  postalCode: number;
  profileImage: string;
  coverImage: string;
  about: string;
  requests: string[];
  followers: string[];
  following: string[];
  savedPost: string[];
  notification:[{
    userId:mongoose.Types.ObjectId
    postId:mongoose.Types.ObjectId
    text:string
  }]
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
    },
    private: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    dob: {
      type: Date,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    postalCode: {
      type: Number,
    },
    profileImage: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    about: {
      type: String,
    },
    requests: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    savedPost:[
      {
        type: Schema.Types.ObjectId,
        ref: "post",
      }
    ],
    notification:[{
      postId:{
        type:mongoose.Types.ObjectId,
        ref:"post"
      },
      userId:{
        type:mongoose.Types.ObjectId,
        ref:"user"
      },
      text:{
        type:String
      }
    }]
  },
  {
    timestamps: true,
  }
);

// Export the model and return your IUser interface
export default mongoose.model<IUser>("user", UserSchema);
