"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require('dotenv').config();
const dbConnect = require('./config/db');
const UserRoute = require('./routes/userRoute');
const AdminRoute = require('./routes/adminRoute');
const app = (0, express_1.default)();
const port = 5000;
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    // origin: ['http://localhost:3000'],
    origin: ['https://www.quickshare.giftto.online'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
    credentials: true,
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar']
}));
app.use('/', UserRoute);
app.use('/admin', AdminRoute);
dbConnect;
app.listen(port, () => {
    console.log(`connected successffully on port ${port}`);
});
