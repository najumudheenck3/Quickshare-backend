import { Request, Response } from "express";
import postModel from "../model/postModel";
import userModel from "../model/userModel";

export const getUserProfile = async (req: Request, res: Response) => {
  console.log("ividae ethgumm");

  const id = req.params.id;
  try {
    const user = await userModel.findOne({ _id: id });
    console.log(user,'ivi mattannam');
    
    const allPosts = await postModel.find({ userId: id }).populate("userId");

    return res.json({user:user, data: allPosts.reverse(), success: true });
  } catch (error) {}
};

export const updateUserProfile = async (req: Request, res: Response) => {
  const userId = req.body.userIdd;
  try {
    const user = await userModel.findById(userId);
    const updateUser = await userModel.findByIdAndUpdate(user?._id, req.body, {
      new: true,
    });
    console.log(updateUser, "kkkkkkkkkkkkkkkkk");
    return res.json({
      data: updateUser,
      message: "profile updated successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      message: "something is wrong",
      success: false,
    });
  }
};

export const followUser = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userIdd;
    const followingUserId = req.body.followingId;
    const followUser = await userModel.findById(followingUserId);
    const currentUser = await userModel.findById(userId);
    console.log(followUser, currentUser);
    if (!currentUser) {
      res.json({ message: " user not exist", success: false });
    }
    if (!followUser) {
      res.json({ message: "following user not exist", success: false });
    }

    if (!followUser?.private) {
      console.log("1");
      if (!followUser?.followers?.includes(userId)) {
        console.log("2");
        await followUser?.updateOne({ $push: { followers: currentUser?._id } });
        await currentUser?.updateOne({ $push: { following: followUser?._id } });
        res.json({ message: "followed new user succesfully", success: true });
      } else {
        console.log("3");
        await followUser?.updateOne({ $pull: { followers: currentUser?._id } });
        await currentUser?.updateOne({ $pull: { following: followUser?._id } });
        res.json({ message: "unfollwed user succesfully", success: true });
      }
    } else {
      console.log("4");
      if (followUser?.followers?.includes(userId)) {
        console.log("5");
        await followUser?.updateOne({ $pull: { followers: currentUser?._id } });
        await currentUser?.updateOne({ $pull: { following: followUser?._id } });
        res.json({ message: "unfollwed user succesfully", success: true });
      } else {
        console.log("6");
        if (!followUser?.requests?.includes(userId)) {
          console.log("7");
          await followUser?.updateOne({
            $push: { requests: currentUser?._id },
          });
          res.json({ message: "request new user successfully", success: true });
        } else {
          await followUser?.updateOne({
            $pull: { requests: currentUser?._id },
          });
          res.json({
            message: "unrequest new user successfully",
            success: true,
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const getAllRequest = async (req: Request, res: Response) => {
  const userId = req.body.userIdd;
  try {
    const requests = await userModel.findById(userId).populate({
      path: "requests",
      select: { firstName: 1, lastName: 1, profileImage: 1 },
    });

    res.json({
      message: "request data fetched successfully",
      requests: requests?.requests,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const acceptRequest = async (req: Request, res: Response) => {
  const userId = req.body.userIdd;
  const acceptId = req.body.userId;
  try {
    const user = await userModel.findById(userId);
    const acceptedUser = await userModel.findById(acceptId);
    if (!user) {
      res.json({ message: "user no exist", success: false });
    }
    if (!acceptedUser) {
      res.json({ message: "requested user not exist", success: false });
    }
    if (user?.requests?.includes(acceptId)) {
      await user.updateOne({ $pull: { requests: acceptId } });
      await user.updateOne({ $push: { followers: acceptId } });
      await acceptedUser?.updateOne({ $push: { following: userId } });
    }
    res.json({
      message: "following request accept successfully ",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteRequest = async (req: Request, res: Response) => {
  const userId = req.body.userIdd;
  const deleteId = req.params.deleteId;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      res.json({ message: "user no exist", success: false });
    }
    if (user?.requests?.includes(deleteId)) {
      await user.updateOne({ $pull: { requests: deleteId } });
      res.json({
        message: "friend request cancel successfully",
        success: true,
      });
    } else {
      res.json({
        message: "something wrong",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getAllFollowers = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    const user = await userModel.findById(userId).populate({
      path: "followers",
      select: { firstName: 1, lastName: 1, profileImage: 1 },
    });

    res.json({
      message: "followers fetched successfully",
      data: user?.followers,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllFollowing = async (req: Request, res: Response) => {
  console.log(req.body, "ini pani thudangammm");
  const userId = req.params.userId;
  try {
    const user = await userModel.findById(userId).populate({
      path: "following",
      select: { firstName: 1, lastName: 1, profileImage: 1 },
    });
    res.json({
      message: "following users fetched successfully",
      data: user?.following,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getChatUser = async (req: Request, res: Response) => {
  console.log(req.params.friendId, "numma iviada ndallooo");
  const userId = req.params.friendId;
  try {
    const user = await userModel.findOne({ _id: userId }, "-password");
    console.log(user, "numma iviada ndallooo");
    if (user) {
      res.json({
        message: "chat user fetched successfully",
        data: user,
        success: true,
      });
    } else {
      res.json({ message: "something wrong", success: false });
    }
  } catch (error) {}
};

export const searchUserList = async (req: Request, res: Response) => {
  try {
    const { searchData: searchExpression } = req.body;
    console.log("this is a search expression");

    const searchData = await userModel.find({
      firstName: { $regex: searchExpression, $options: "i" },
    });
    if (searchData) {
      res.status(200).json(searchData);
    } else {
      res.status(404).json({ noUsers: true });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const setPrivateAccount = async (req: Request, res: Response) => {
  console.log("ividunn nadakkunnund");

  const userId = req.body.userIdd;
  try {
    const user = await userModel.findById(userId);
    if (user) {
      if (user.private) {
        user.private = false;
      } else {
        user.private = true;
      }
      await user.save();
    }
    res.send({
      message: "private account change successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllNotification = async (req: Request, res: Response) => {
  try {
    const user = await userModel
      .find({ _id: req.body.userIdd })
      .populate("notification.userId", {
        firstName: 1,
        lastName: 1,
        _id: 1,
        profileImage: 1,
      });

    if (user) {
      console.log(user[0]?.notification, "user   notifications");
      res.json({ success: true, data: user[0]?.notification.reverse() });
    }
  } catch (error) {
    console.log(error);
  }
};

export const suggestionUsers = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userIdd;
    const user = await userModel.findOne({ _id: userId });
    if (!user) return;
    const notFollowedUsers = await userModel.aggregate([
      {
        $match: {
          $and: [{ _id: { $nin: user.following } }, { _id: { $ne: userId } }],
        },
      },
      { $sample: { size: 4 } },
    ]);

    res.send({
      message: "suggestion users fetched successfully",
      success: true,
      data: notFollowedUsers,
    });
  } catch (error) {}
};
