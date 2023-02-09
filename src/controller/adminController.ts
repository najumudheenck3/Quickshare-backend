import { Request, Response } from "express";
import adminModel from "../model/adminModel";
import userModel from "../model/userModel";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

export const loginAdmin = async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;

    const admin = await adminModel.findOne({ email: email });
    console.log(admin, "admindetailssss");

    if (!admin) {
      return res
        .status(400)
        .json({ message: "Invalid Credddentials", success: false });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid Credttenggftials", success: false });
    }
    //generate token

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      //expire the token within
      expiresIn: "1d",
    });
    res
      .status(200)
      .json({
        message: "SignIn Successfully",
        success: true,
        data: token,
        admin: admin.name,
      });
  } catch (error) {}
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    console.log("adminlogindata");
    const allUsers = await userModel.find({});
    res.status(200).send({
      message: "Users fetched successfully",
      success: true,
      data: allUsers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "error in fetching users",
      success: false,
      error,
    });
  }
};

export const changeUserStatus = async (req: Request, res: Response) => {
  try {
    console.log(req.body, "blocking iddd");
    const userId = req.body.userId;
    console.log(userId);

    const user = await userModel.findById({ _id: userId });
    console.log(user, "blockign user");

    if (user) {
      if (user.isActive) {
        console.log(user, "blocki1111gn user");
        user.isActive = false;
      } else {
        console.log(user, "blocki2222gn user");
        user.isActive = true;
      }
      await user.save();
    }
    const users = await userModel.find({});
    res.status(200).send({
      message: "Users-status change successfully",
      success: true,
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "error in fetching users",
      success: false,
      error,
    });
  }
};

export const getAllNotification=async(req: Request, res: Response)=>{
  try{
     
    const admin=await adminModel.find({username:"admin"}).populate('notification.userId', { firstName: 1, lastName: 1, _id: 1, profileImage: 1 })

 if(admin){
  console.log(admin[0]?.notification,'notifications');
  res.status(200).send({ success: true,data:admin[0]?.notification });
 }
  


  }catch(error){
    console.log(error);

  }
}

export const fetDashboardDetails=async (req: Request, res: Response)=>{
  try {
    const userCount=await userModel.find({}).count()
    const activeCount=await userModel.find({isActive:true}).count()
    console.log(activeCount,'userCountuserCount');
    res.status(200).send({
      message: "all datas fetched successfully",
      success: true,
      userCount: userCount,
      activeCount:activeCount,
    });
  } catch (error) {
    
  }

}
