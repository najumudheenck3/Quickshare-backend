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
exports.suggestionUsers = exports.getAllNotification = exports.setPrivateAccount = exports.searchUserList = exports.getChatUser = exports.getAllFollowing = exports.getAllFollowers = exports.deleteRequest = exports.acceptRequest = exports.getAllRequest = exports.followUser = exports.updateUserProfile = exports.getUserProfile = void 0;
const postModel_1 = __importDefault(require("../model/postModel"));
const userModel_1 = __importDefault(require("../model/userModel"));
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("ividae ethgumm");
    const id = req.params.id;
    try {
        const user = yield userModel_1.default.findOne({ _id: id });
        console.log(user, 'ivi mattannam');
        const allPosts = yield postModel_1.default.find({ userId: id }).populate("userId");
        return res.json({ user: user, data: allPosts.reverse(), success: true });
    }
    catch (error) { }
});
exports.getUserProfile = getUserProfile;
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userIdd;
    try {
        const user = yield userModel_1.default.findById(userId);
        const updateUser = yield userModel_1.default.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user._id, req.body, {
            new: true,
        });
        console.log(updateUser, "kkkkkkkkkkkkkkkkk");
        return res.json({
            data: updateUser,
            message: "profile updated successfully",
            success: true,
        });
    }
    catch (error) {
        console.log(error);
        return res.json({
            message: "something is wrong",
            success: false,
        });
    }
});
exports.updateUserProfile = updateUserProfile;
const followUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const userId = req.body.userIdd;
        const followingUserId = req.body.followingId;
        const followUser = yield userModel_1.default.findById(followingUserId);
        const currentUser = yield userModel_1.default.findById(userId);
        console.log(followUser, currentUser);
        if (!currentUser) {
            res.json({ message: " user not exist", success: false });
        }
        if (!followUser) {
            res.json({ message: "following user not exist", success: false });
        }
        if (!(followUser === null || followUser === void 0 ? void 0 : followUser.private)) {
            console.log("1");
            if (!((_a = followUser === null || followUser === void 0 ? void 0 : followUser.followers) === null || _a === void 0 ? void 0 : _a.includes(userId))) {
                console.log("2");
                yield (followUser === null || followUser === void 0 ? void 0 : followUser.updateOne({ $push: { followers: currentUser === null || currentUser === void 0 ? void 0 : currentUser._id } }));
                yield (currentUser === null || currentUser === void 0 ? void 0 : currentUser.updateOne({ $push: { following: followUser === null || followUser === void 0 ? void 0 : followUser._id } }));
                res.json({ message: "followed new user succesfully", success: true });
            }
            else {
                console.log("3");
                yield (followUser === null || followUser === void 0 ? void 0 : followUser.updateOne({ $pull: { followers: currentUser === null || currentUser === void 0 ? void 0 : currentUser._id } }));
                yield (currentUser === null || currentUser === void 0 ? void 0 : currentUser.updateOne({ $pull: { following: followUser === null || followUser === void 0 ? void 0 : followUser._id } }));
                res.json({ message: "unfollwed user succesfully", success: true });
            }
        }
        else {
            console.log("4");
            if ((_b = followUser === null || followUser === void 0 ? void 0 : followUser.followers) === null || _b === void 0 ? void 0 : _b.includes(userId)) {
                console.log("5");
                yield (followUser === null || followUser === void 0 ? void 0 : followUser.updateOne({ $pull: { followers: currentUser === null || currentUser === void 0 ? void 0 : currentUser._id } }));
                yield (currentUser === null || currentUser === void 0 ? void 0 : currentUser.updateOne({ $pull: { following: followUser === null || followUser === void 0 ? void 0 : followUser._id } }));
                res.json({ message: "unfollwed user succesfully", success: true });
            }
            else {
                console.log("6");
                if (!((_c = followUser === null || followUser === void 0 ? void 0 : followUser.requests) === null || _c === void 0 ? void 0 : _c.includes(userId))) {
                    console.log("7");
                    yield (followUser === null || followUser === void 0 ? void 0 : followUser.updateOne({
                        $push: { requests: currentUser === null || currentUser === void 0 ? void 0 : currentUser._id },
                    }));
                    res.json({ message: "request new user successfully", success: true });
                }
                else {
                    yield (followUser === null || followUser === void 0 ? void 0 : followUser.updateOne({
                        $pull: { requests: currentUser === null || currentUser === void 0 ? void 0 : currentUser._id },
                    }));
                    res.json({
                        message: "unrequest new user successfully",
                        success: true,
                    });
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.followUser = followUser;
const getAllRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userIdd;
    try {
        const requests = yield userModel_1.default.findById(userId).populate({
            path: "requests",
            select: { firstName: 1, lastName: 1, profileImage: 1 },
        });
        res.json({
            message: "request data fetched successfully",
            requests: requests === null || requests === void 0 ? void 0 : requests.requests,
            success: true,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getAllRequest = getAllRequest;
const acceptRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const userId = req.body.userIdd;
    const acceptId = req.body.userId;
    try {
        const user = yield userModel_1.default.findById(userId);
        const acceptedUser = yield userModel_1.default.findById(acceptId);
        if (!user) {
            res.json({ message: "user no exist", success: false });
        }
        if (!acceptedUser) {
            res.json({ message: "requested user not exist", success: false });
        }
        if ((_d = user === null || user === void 0 ? void 0 : user.requests) === null || _d === void 0 ? void 0 : _d.includes(acceptId)) {
            yield user.updateOne({ $pull: { requests: acceptId } });
            yield user.updateOne({ $push: { followers: acceptId } });
            yield (acceptedUser === null || acceptedUser === void 0 ? void 0 : acceptedUser.updateOne({ $push: { following: userId } }));
        }
        res.json({
            message: "following request accept successfully ",
            success: true,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.acceptRequest = acceptRequest;
const deleteRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const userId = req.body.userIdd;
    const deleteId = req.params.deleteId;
    try {
        const user = yield userModel_1.default.findById(userId);
        if (!user) {
            res.json({ message: "user no exist", success: false });
        }
        if ((_e = user === null || user === void 0 ? void 0 : user.requests) === null || _e === void 0 ? void 0 : _e.includes(deleteId)) {
            yield user.updateOne({ $pull: { requests: deleteId } });
            res.json({
                message: "friend request cancel successfully",
                success: true,
            });
        }
        else {
            res.json({
                message: "something wrong",
                success: false,
            });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.deleteRequest = deleteRequest;
const getAllFollowers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const user = yield userModel_1.default.findById(userId).populate({
            path: "followers",
            select: { firstName: 1, lastName: 1, profileImage: 1 },
        });
        res.json({
            message: "followers fetched successfully",
            data: user === null || user === void 0 ? void 0 : user.followers,
            success: true,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getAllFollowers = getAllFollowers;
const getAllFollowing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body, "ini pani thudangammm");
    const userId = req.params.userId;
    try {
        const user = yield userModel_1.default.findById(userId).populate({
            path: "following",
            select: { firstName: 1, lastName: 1, profileImage: 1 },
        });
        res.json({
            message: "following users fetched successfully",
            data: user === null || user === void 0 ? void 0 : user.following,
            success: true,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getAllFollowing = getAllFollowing;
const getChatUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params.friendId, "numma iviada ndallooo");
    const userId = req.params.friendId;
    try {
        const user = yield userModel_1.default.findOne({ _id: userId }, "-password");
        console.log(user, "numma iviada ndallooo");
        if (user) {
            res.json({
                message: "chat user fetched successfully",
                data: user,
                success: true,
            });
        }
        else {
            res.json({ message: "something wrong", success: false });
        }
    }
    catch (error) { }
});
exports.getChatUser = getChatUser;
const searchUserList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { searchData: searchExpression } = req.body;
        console.log("this is a search expression");
        const searchData = yield userModel_1.default.find({
            firstName: { $regex: searchExpression, $options: "i" },
        });
        if (searchData) {
            res.status(200).json(searchData);
        }
        else {
            res.status(404).json({ noUsers: true });
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.searchUserList = searchUserList;
const setPrivateAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("ividunn nadakkunnund");
    const userId = req.body.userIdd;
    try {
        const user = yield userModel_1.default.findById(userId);
        if (user) {
            if (user.private) {
                user.private = false;
            }
            else {
                user.private = true;
            }
            yield user.save();
        }
        res.send({
            message: "private account change successfully",
            success: true,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.setPrivateAccount = setPrivateAccount;
const getAllNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f, _g;
    try {
        const user = yield userModel_1.default
            .find({ _id: req.body.userIdd })
            .populate("notification.userId", {
            firstName: 1,
            lastName: 1,
            _id: 1,
            profileImage: 1,
        });
        if (user) {
            console.log((_f = user[0]) === null || _f === void 0 ? void 0 : _f.notification, "user   notifications");
            res.json({ success: true, data: (_g = user[0]) === null || _g === void 0 ? void 0 : _g.notification.reverse() });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.getAllNotification = getAllNotification;
const suggestionUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.userIdd;
        const user = yield userModel_1.default.findOne({ _id: userId });
        if (!user)
            return;
        const notFollowedUsers = yield userModel_1.default.aggregate([
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
    }
    catch (error) { }
});
exports.suggestionUsers = suggestionUsers;
