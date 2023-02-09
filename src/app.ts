import express, { Application, Request, Response } from "express";
import CORS from 'cors'
require('dotenv').config()
const dbConnect=require('./config/db')
const UserRoute = require('./routes/userRoute')
const AdminRoute= require('./routes/adminRoute')

const app: Application = express();
const port: Number = 5000;

app.use(express.json());
app.use(CORS({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST','PUT','DELETE'],
    credentials: true,
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar']},
    ))

app.use('/',UserRoute)
app.use('/admin',AdminRoute)

dbConnect;
app.listen(port, () => {
  console.log(`connected successffully on port ${port}`);
});
