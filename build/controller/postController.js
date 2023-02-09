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
exports.changePostStatus = exports.getAllReportedPosts = exports.getShorts = exports.createShorts = exports.reportPost = exports.editPost = exports.deletePost = exports.getAllSAvedPost = exports.savePost = exports.likePost = exports.getPost = exports.createPost = void 0;
const userModel_1 = __importDefault(require("../model/userModel"));
const postModel_1 = __importDefault(require("../model/postModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const reportModel_1 = __importDefault(require("../model/reportModel"));
const adminModel_1 = __importDefault(require("../model/adminModel"));
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { imageLinkss, desscription, userIdd } = req.body;
    try {
        const post = new postModel_1.default({
            userId: userIdd,
            descripcion: desscription,
            img: imageLinkss,
        });
        yield post.save();
        return res.json({ message: "post uploaded successfully", success: true });
    }
    catch (error) { }
});
exports.createPost = createPost;
const getPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allPosts = yield postModel_1.default.find({ shorts: null }).populate("userId");
        return res.json({ data: allPosts.reverse(), success: true });
    }
    catch (error) { }
});
exports.getPost = getPost;
const likePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.postId;
    const userId = req.body.userIdd;
    try {
        const post = yield postModel_1.default.findById(id);
        if (!post) {
            return res.json({ message: "post not found", success: false });
        }
        if (!post.likes.includes(userId)) {
            console.log(post, "ithall likepost");
            yield post.updateOne({ $push: { likes: userId } });
            if (userId !== post.userId) {
                yield userModel_1.default.findOneAndUpdate({ _id: post.userId }, {
                    $push: {
                        notification: {
                            postId: post._id,
                            userId: userId,
                            text: "liked your post",
                        }
                    }
                });
            }
            return res.json({ message: "post liked successfully", success: true });
        }
        else {
            yield post.updateOne({ $pull: { likes: userId } });
            return res.json({ message: "post disliked successfully", success: true });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.likePost = likePost;
const savePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.body.postId;
    const userId = req.body.userIdd;
    try {
        const user = yield userModel_1.default.findById(userId);
        if (!user) {
            res.json({ message: "user no exist", success: false });
        }
        else {
            if (!(user === null || user === void 0 ? void 0 : user.savedPost.includes(postId))) {
                yield user.updateOne({
                    $push: { savedPost: new mongoose_1.default.Types.ObjectId(postId) },
                });
                res.json({ Message: "post saved successfully", success: true });
            }
            else {
                yield user.updateOne({
                    $pull: { savedPost: new mongoose_1.default.Types.ObjectId(postId) },
                });
                res.json({ Message: "post unsaved successfully", success: true });
            }
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.savePost = savePost;
const getAllSAvedPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body, "endayalyum ividay ethunnund");
    const userId = req.body.userIdd;
    try {
        const user = yield userModel_1.default
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
        console.log(user === null || user === void 0 ? void 0 : user.savedPost, "userrrrrrrrrrrrrrrrrrrrrr");
        res.json({ Message: "saved post data fetched successfully", data: user === null || user === void 0 ? void 0 : user.savedPost, success: true });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getAllSAvedPost = getAllSAvedPost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params, 'ini nokkam');
    const postId = req.params.postId;
    try {
        const response = yield postModel_1.default.findByIdAndDelete({ _id: postId });
        res.json({ success: true, message: "deleted post successfully" });
    }
    catch (error) {
        console.log(error);
    }
});
exports.deletePost = deletePost;
const editPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const postId = req.body.postId;
    const descripcion = req.body.editDescription;
    try {
        const afterEdit = yield postModel_1.default.findByIdAndUpdate(postId, { descripcion });
        res.json({ success: true, message: "edit post successfully" });
    }
    catch (error) {
    }
});
exports.editPost = editPost;
const reportPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log(req.body);
    const userId = req.body.userIdd;
    const postId = req.body.postId;
    const text = req.body.reason;
    try {
        const admin = yield adminModel_1.default.findOne({ username: "admin" });
        const report = yield reportModel_1.default.findOne({
            postId
        });
        console.log(report);
        if (report) {
            (_a = report === null || report === void 0 ? void 0 : report.userText) === null || _a === void 0 ? void 0 : _a.push({
                userId: userId,
                text: text,
            });
            report.save();
            res.json({
                success: true,
                message: "report post successfully",
            });
            admin === null || admin === void 0 ? void 0 : admin.notification.push({
                userId: userId,
                text: "reported a post",
            });
            admin === null || admin === void 0 ? void 0 : admin.save();
        }
        else {
            yield new reportModel_1.default({
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
            admin === null || admin === void 0 ? void 0 : admin.notification.push({
                userId: userId,
                text: "reported a post",
            });
            admin === null || admin === void 0 ? void 0 : admin.save();
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.reportPost = reportPost;
const createShorts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { videoLinks, desscription, userIdd } = req.body;
    try {
        const post = new postModel_1.default({
            userId: userIdd,
            descripcion: desscription,
            shorts: videoLinks,
        });
        yield post.save();
        return res.json({ message: "post uploaded successfully", success: true });
    }
    catch (error) { }
});
exports.createShorts = createShorts;
const getShorts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allShorts = yield postModel_1.default.find({ shorts: { $exists: true } }).populate("userId");
        return res.json({ data: allShorts.reverse(), success: true });
    }
    catch (error) { }
});
exports.getShorts = getShorts;
const getAllReportedPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("adminlogindata");
        const allReportedPosts = yield reportModel_1.default.find({}).populate("postId").populate([{ path: 'postId', populate: { path: 'userId' } }]).populate("userText.userId");
        res.send({
            message: "reported posts fetched successfully",
            success: true,
            data: allReportedPosts,
        });
    }
    catch (error) {
        console.log(error);
        res.send({
            message: "error in fetching reported posts",
            success: false,
            error,
        });
    }
});
exports.getAllReportedPosts = getAllReportedPosts;
const changePostStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body, "blocking iddd");
        const postId = req.body.postId;
        console.log(postId);
        const post = yield postModel_1.default.findById({ _id: postId });
        console.log(post, "blockign user");
        if (post) {
            if (post.isActive) {
                console.log(post, "blocki1111gn user");
                post.isActive = false;
            }
            else {
                console.log(post, "blocki2222gn user");
                post.isActive = true;
            }
            yield post.save();
        }
        const allReportedPosts = yield reportModel_1.default.find({}).populate("postId").populate("userText.userId");
        res.send({
            message: "Post-status change successfully",
            success: true,
            data: allReportedPosts,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            message: "error in fetching post",
            success: false,
            error,
        });
    }
});
exports.changePostStatus = changePostStatus;
