import mongoose, { model, Schema, Document } from 'mongoose'

interface token extends Document {
  name: string
  email: string
  password: String
  notification:[{
    userId:mongoose.Types.ObjectId,
    text:string
  }]
}
const adminSchema: Schema = new Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  notification:[{
    userId:{
      type:Schema.Types.ObjectId,
      ref:"user"
    },
    text:{
      type:String
    }
  }]
})

export default model<token>('admin', adminSchema)