import { Request, Response } from "express";
import commentModel from "../model/commentModel";
import postModel from "../model/postModel";
import userModel from "../model/userModel";
import mongoose from "mongoose";
import commentReplyModel from "../model/commentReplyModel";

export const postComment = async (req: Request, res: Response) => {
  const comment = req.body.comment;
  const userId = req.body.userIdd;
  const postId = req.params.postId;
  try {
    const post = await postModel.findById(postId);
    if (!post) {
      return res.json({ message: "post not found", success: false });
    }
    const postComment = new commentModel({
      userId,
      postId,
      comment,
    });
    await postComment.save();

    await userModel.populate(postComment, {
      path: "userId",
      select: { firstName: 1,lastName:1,profileImage:1 },
    });
    console.log(postComment, "postcomment aafter populate");
    if( userId !== post.userId){

      await userModel.findOneAndUpdate(
       { _id: post.userId},
       {
         $push: {
           notification: { 
             postId:post._id,
             userId: userId,
             text: "commented your post",
         }
         }
       }
     );
    }
  
    res.json({message:'commented posted successfully',success:true,comment:postComment})
    
  } catch (error) {}
};

export const getAllPosts = async (req: Request, res: Response) => {
  const postId = req.params.postId;
  try {
    const comments = await commentModel.aggregate([
      {
        $match: {
          postId: new mongoose.Types.ObjectId(postId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: {
          path: "$author",
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          postId: 1,
          comment: 1,
          likes: 1,
          createdAt: 1,
          "author.firstName": 1,
          "author.lastName": 1,
          "author.profileImage":1,
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ["$$ROOT", "$author"],
          },
        },
      },
      {
        $project: {
          author: 0,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);
    return res.json({message:"comments fetched successfully", comments: comments, success: true });
  } catch (error) {
    console.log(error);
    return res.json({message:"something wrong when fetching comments",success:false})
    
  }
};

export const postCommentReply=async(req: Request, res: Response)=>{
  console.log(req.body,req.params,'post comment rep;ay');
  const comment = req.body.replyComment;
  const userId = req.body.userIdd;
  const commentId = req.params.commentId;
  try {
    const currentComment = await commentModel.findById(commentId);
    if (!currentComment) {
      return res.json({ message: "comment not found", success: false });
    }
    const replyComment = new commentReplyModel({
      userId,
      commentId,
      comment,
    });
    await replyComment.save();

    await userModel.populate(replyComment, {
      path: "userId",
      select: { firstName: 1,lastName:1 ,profileImage:1},
    });
    console.log(replyComment, "postcomment aafter populate");
  
    res.json({message:'comment reply posted successfully',success:true,replyComment:replyComment})
    
  } catch (error) {
    console.log(error);
    
  }
}

export const getAllCommentReply=async(req: Request, res: Response)=>{
  console.log(req.params, "endayaluym iviada etheeknn reply commetybackinokkam");
  const commentId = req.params.commentId;
  try {
    const commentsReplies = await commentReplyModel.aggregate([
      {
        $match: {
          commentId: new mongoose.Types.ObjectId(commentId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: {
          path: "$author",
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          commentId: 1,
          comment: 1,
          likes: 1,
          createdAt: 1,
          "author.firstName": 1,
          "author.lastName": 1,
          "author.profileImage":1,
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ["$$ROOT", "$author"],
          },
        },
      },
      {
        $project: {
          author: 0,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);
    console.log(commentsReplies, "allpost comments");
    return res.json({message:"commentreplies fetched successfully", commentsReplies: commentsReplies, success: true });
  } catch (error) {
    console.log(error);
  }
} 

export const likeComment=async(req: Request, res: Response)=>{
  const id = req.params.commentId;
  const userId = req.body.userIdd;
  try {
    const comment = await commentModel.findById(id);
    if (!comment) {
      return res.json({ message: "post not found", success: false });
    }

    if (!comment.likes.includes(userId)) {
      console.log(comment, "ithall likepost");
      await comment.updateOne({ $push: { likes: userId } });
      return res.json({ message: "post liked successfully", success: true });
    } else {
      await comment.updateOne({ $pull: { likes: userId } });
      return res.json({ message: "post disliked successfully", success: true });
    }
  } catch (error) {
    console.log(error);
  }
}