import { Request, Response } from "express";
import userModel from "../model/userModel";
import postModel from "../model/postModel";
import mongoose from "mongoose";
import reportModel from "../model/reportModel";
import adminModel from "../model/adminModel";

export const createPost = async (req: Request, res: Response) => {
  const { imageLinkss, desscription, userIdd } = req.body;
  try {
    const post = new postModel({
      userId: userIdd,
      descripcion: desscription,
      img: imageLinkss,
    });
    await post.save();
    return res.json({ message: "post uploaded successfully", success: true });
  } catch (error) {}
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const allPosts = await postModel.find({shorts:null}).populate("userId");
    return res.json({ data: allPosts.reverse(), success: true });
  } catch (error) {}
};

export const likePost = async (req: Request, res: Response) => {
  const id = req.params.postId;
  const userId = req.body.userIdd;
  try {
    const post = await postModel.findById(id);
    if (!post) {
      return res.json({ message: "post not found", success: false });
    }
    if (!post.likes.includes(userId)) {
      console.log(post, "ithall likepost");
      await post.updateOne({ $push: { likes: userId } });
      if( userId !== post.userId){

        await userModel.findOneAndUpdate(
         { _id: post.userId},
         {
           $push: {
             notification: { 
               postId:post._id,
               userId: userId,
               text: "liked your post",
           }
           }
         }
       );
      }
      return res.json({ message: "post liked successfully", success: true });
    } else {
      await post.updateOne({ $pull: { likes: userId } });
      return res.json({ message: "post disliked successfully", success: true });
    }
  } catch (error) {
    console.log(error);
  }
};

export const savePost = async (req: Request, res: Response) => {
  const postId = req.body.postId;
  const userId = req.body.userIdd;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      res.json({ message: "user no exist", success: false });
    } else {
      if (!user?.savedPost.includes(postId)) {
        await user.updateOne({
          $push: { savedPost: new mongoose.Types.ObjectId(postId) },
        });
        res.json({ Message: "post saved successfully", success: true });
      } else {
        await user.updateOne({
          $pull: { savedPost: new mongoose.Types.ObjectId(postId) },
        });
        res.json({ Message: "post unsaved successfully", success: true });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const getAllSAvedPost = async (req: Request, res: Response) => {
  console.log(req.body, "endayalyum ividay ethunnund");
  const userId = req.body.userIdd;
  try {
    const user = await userModel
      .findById(userId)
      .populate([
        {
          path: "savedPost",
          populate: {
            path: "userId",
            select: { firstName: 1, lastName: 1, profileImage: 1 },
          },
        },
      ]);
    console.log(user?.savedPost, "userrrrrrrrrrrrrrrrrrrrrr");
    res.json({ Message: "saved post data fetched successfully",data:user?.savedPost, success: true });
  } catch (error) {
    console.log(error);
    
  }
};

export const deletePost=async(req: Request, res: Response)=>{
  console.log(req.params,'ini nokkam');
  const postId=req.params.postId
  try {
    const response = await postModel.findByIdAndDelete({ _id: postId });
    res.json({ success: true, message: "deleted post successfully" });
  } catch (error) {
    console.log(error);
    
  }
}

export const editPost=async(req: Request, res: Response)=>{
  console.log(req.body);
  const postId=req.body.postId
  const descripcion=req.body.editDescription
  try {
    const afterEdit=await postModel.findByIdAndUpdate(postId,{descripcion})
    res.json({ success: true, message: "edit post successfully" });
  } catch (error) {
    
  }
}

export const reportPost=async(req: Request, res: Response)=>{
  console.log(req.body);
  const userId=req.body.userIdd
  const postId=req.body.postId
  const text=req.body.reason
  try {
    const admin = await adminModel.findOne({ username: "admin" });
    const report=await reportModel.findOne({
      postId
    })
    console.log(report);
    if (report) {
      report?.userText?.push({
        userId: userId,
        text: text,
      });
      report.save();
      res.json({
        success: true,
        message: "report post successfully",
      });
      admin?.notification.push({
        userId: userId,
        text: "reported a post",
      });
      admin?.save();
    } else {
      await new reportModel({
        postId,
        userText: [
          {
            userId: userId,
            text: text,
          },
        ],
      }).save();
  
      res.json({
        success: true,
        message: "report post successfully",
      });
      admin?.notification.push({
        userId: userId,
        text: "reported a post",
      });
      admin?.save();
    }
    
  } catch (error) {
    console.log(error);
    
  }
}


export const createShorts = async (req: Request, res: Response) => {
  const { videoLinks, desscription, userIdd } = req.body;
  try {
    const post = new postModel({
      userId: userIdd,
      descripcion: desscription,
      shorts: videoLinks,
    });
    await post.save();
    return res.json({ message: "post uploaded successfully", success: true });
  } catch (error) {}
};

export const getShorts = async (req: Request, res: Response) => {
  try {
    const allShorts = await postModel.find({shorts:{$ne:null}}).populate("userId");
   
    return res.json({ data: allShorts.reverse(), success: true });
  } catch (error) {}
};

export const getAllReportedPosts=async(req: Request, res: Response)=>{
  try {
    console.log("adminlogindata");
    const allReportedPosts = await reportModel.find({}).populate("postId").populate([{ path: 'postId', populate: { path: 'userId' }}]).populate("userText.userId");

    res.send({
      message: "reported posts fetched successfully",
      success: true,
      data: allReportedPosts,
    });
  } catch (error) {
    console.log(error);
    res.send({
      message: "error in fetching reported posts",
      success: false,
      error,
    });
  }
}

export const changePostStatus=async(req: Request, res: Response)=>{
  try {
    console.log(req.body, "blocking iddd");
    const postId = req.body.postId;
    console.log(postId);

    const post = await postModel.findById({ _id: postId });
    console.log(post, "blockign user");

    if (post) {
      if (post.isActive) {
        console.log(post, "blocki1111gn user");
        post.isActive = false;
      } else {
        console.log(post, "blocki2222gn user");
        post.isActive = true;
      }
      await post.save();
    }
    const allReportedPosts = await reportModel.find({}).populate("postId").populate("userText.userId");
    res.send({
      message: "Post-status change successfully",
      success: true,
      data: allReportedPosts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "error in fetching post",
      success: false,
      error,
    });
  }
}