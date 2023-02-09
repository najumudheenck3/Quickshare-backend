import mongoose, { ConnectOptions } from "mongoose";


const mongooseconnect :string | undefined = process.env.MONGO_URL
if(mongooseconnect){
    mongoose.connect(mongooseconnect)
}

mongoose.Promise=global.Promise

const connection = mongoose.connection

connection.on('connected', () => {
    console.log('Mongodb is connected');
})

connection.on('error', (err) => {
    console.log('error in  mongodb connection', err);
})

module.exports=mongoose
