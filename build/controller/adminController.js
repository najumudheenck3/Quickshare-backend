"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginAdmin = void 0;
const adminModel_1 = __importDefault(require("../model/adminModel"));
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const loginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("adminlogindata");
    console.log(req.body);
    try {
        const { email, password } = req.body;
        const admin = yield adminModel_1.default.findOne({ email });
        console.log(admin, "admindetailssss");
        if (!admin) {
            return res.status(400).json({ message: "Invalid Credentials", success: false });
        }
        const isMatch = yield bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials", success: false });
        }
        //generate token
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
            //expire the token within
            expiresIn: "1d"
        });
        res.status(200).json({ message: "SignIn Successfully", success: true, data: token, admin: admin.name });
    }
    catch (error) {
    }
});
exports.loginAdmin = loginAdmin;
