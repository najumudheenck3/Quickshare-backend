import { Request, Response } from "express";
import userModel from "../model/userModel";
import tokenModel from "../model/tokenModel";
import sendEmail from "../config/nodemailer";
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

export const registerUser = async (req: Request, res: Response) => {
  console.log("llll");

  console.log(req.body);
  const { firstName, lastName, email, password } = req.body;
  try {
    const userExist = await userModel.findOne({ email });
    if (userExist) {
      return res.json({ message: "This user already exist", success: false });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);

    const user = new userModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await user.save();

    let token = await new tokenModel({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    const message = `Please click the link to Verify your account   ${process.env.BASE_URL}/verify?id=${user.id}&token=${token.token}`;
    await sendEmail(user.email, "Verify Email", message);
    console.log(message, "message");

    res.json({
      message: "An Email sent to your account please verify",
      success: true,
    });
  } catch (error) {}
};

export const loginUser = async (req: Request, res: Response) => {
  // console.log("logindata");
  // console.log(req.body);
  try {
    const { email, password } = req.body;

   

    const user = await userModel.findOne({ email });

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
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);
    const isMatch = await bcrypt.compare(password, user.password);
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
  } catch (error) {}
};

export const verifyAccount = async (req: Request, res: Response) => {
  try {
    console.log("vefify email");
    console.log(req.body);

    const { userId, token } = req.body;
    const user = await userModel.findOne({ _id: userId });
    console.log(user, "USERS");

    if (!user) {
      return res.json({
        message: "verification linkkk is not valid",
        success: false,
      });
    }
    console.log(user._id, "user");
    console.log(token);

    const userToken = await tokenModel.findOne({
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

    await userModel.findByIdAndUpdate(user._id, { verified: true });
    await tokenModel.findByIdAndRemove(userToken._id);
    return res.json({ message: "email verified sucessfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};
