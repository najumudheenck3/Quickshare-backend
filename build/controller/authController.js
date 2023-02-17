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
exports.verifyAccount = exports.loginUser = exports.registerUser = void 0;
const userModel_1 = __importDefault(require("../model/userModel"));
const tokenModel_1 = __importDefault(require("../model/tokenModel"));
const nodemailer_1 = __importDefault(require("../config/nodemailer"));
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("llll");
    console.log(req.body);
    const { firstName, lastName, email, password } = req.body;
    try {
        const userExist = yield userModel_1.default.findOne({ email });
        if (userExist) {
            return res.json({ message: "This user already exist", success: false });
        }
        const salt = yield bcrypt.genSalt(10);
        const hashedPassword = yield bcrypt.hash(password, salt);
        console.log(hashedPassword);
        const user = new userModel_1.default({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });
        yield user.save();
        let token = yield new tokenModel_1.default({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex"),
        }).save();
        const message = `Please click the link to Verify your account   ${process.env.BASE_URL}/verify?id=${user.id}&token=${token.token}`;
        yield (0, nodemailer_1.default)(user.email, "Verify Email", message);
        console.log(message, "message");
        res.json({
            message: "An Email sent to your account please verify",
            success: true,
        });
    }
    catch (error) { }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("logindata");
    // console.log(req.body);
    try {
        const { email, password } = req.body;
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            return res.json({ message: "Invalid Credentials", success: false });
        }
        if (!user.verified) {
            return res.json({
                message: "send a link to your mail,please confirm",
                success: false,
            });
        }
        if (!user.isActive) {
            return res.json({ message: "Blodked you", success: false });
        }
        const salt = yield bcrypt.genSalt(10);
        const hashedPassword = yield bcrypt.hash(password, salt);
        console.log(hashedPassword);
        const isMatch = yield bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ message: "Invalid Credentials", success: false });
        }
        //generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            //expire the token within
            expiresIn: "1d",
        });
        user.password = "";
        res
            .status(200)
            .json({
            message: "SignIn Successfully",
            success: true,
            data: token,
            user: user,
        });
    }
    catch (error) { }
});
exports.loginUser = loginUser;
const verifyAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("vefify email");
        console.log(req.body);
        const { userId, token } = req.body;
        const user = yield userModel_1.default.findOne({ _id: userId });
        console.log(user, "USERS");
        if (!user) {
            return res.json({
                message: "verification linkkk is not valid",
                success: false,
            });
        }
        console.log(user._id, "user");
        console.log(token);
        const userToken = yield tokenModel_1.default.findOne({
            userId: user._id,
            token: token,
        });
        console.log("token", token);
        console.log(userToken);
        if (!userToken) {
            return res.json({
                message: "verification linkhhhh is not valid",
                success: false,
            });
        }
        console.log(user._id, "ibidyanoo thettunnat");
        yield userModel_1.default.findByIdAndUpdate(user._id, { verified: true });
        yield tokenModel_1.default.findByIdAndRemove(userToken._id);
        return res.json({ message: "email verified sucessfully", success: true });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
});
exports.verifyAccount = verifyAccount;
