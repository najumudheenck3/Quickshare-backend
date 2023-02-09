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
exports.likeComment = exports.getAllCommentReply = exports.postCommentReply = exports.getAllPosts = exports.postComment = void 0;
const commentModel_1 = __importDefault(require("../model/commentModel"));
const postModel_1 = __importDefault(require("../model/postModel"));
const userModel_1 = __importDefault(require("../model/userModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const commentReplyModel_1 = __importDefault(require("../model/commentReplyModel"));
const postComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = req.body.comment;
    const userId = req.body.userIdd;
    const postId = req.params.postId;
    try {
        const post = yield postModel_1.default.findById(postId);
        if (!post) {
            return res.json({ message: "post not found", success: false });
        }
        const postComment = new commentModel_1.default({
            userId,
            postId,
            comment,
        });
        yield postComment.save();
        yield userModel_1.default.populate(postComment, {
            path: "userId",
            select: { firstName: 1, lastName: 1, profileImage: 1 },
        });
        console.log(postComment, "postcomment aafter populate");
        if (userId !== post.userId) {
            yield userModel_1.default.findOneAndUpdate({ _id: post.userId }, {
                $push: {
                    notification: {
                        postId: post._id,
                        userId: userId,
                        text: "commented your post",
                    }
                }
            });
        }
        res.json({ message: 'commented posted successfully', success: true, comment: postComment });
    }
    catch (error) { }
});
exports.postComment = postComment;
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    try {
        const comments = yield commentModel_1.default.aggregate([
            {
                $match: {
                    postId: new mongoose_1.default.Types.ObjectId(postId),
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
                    "author.profileImage": 1,
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
        return res.json({ message: "comments fetched successfully", comments: comments, success: true });
    }
    catch (error) {
        console.log(error);
        return res.json({ message: "something wrong when fetching comments", success: false });
    }
});
exports.getAllPosts = getAllPosts;
const postCommentReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body, req.params, 'post comment rep;ay');
    const comment = req.body.replyComment;
    const userId = req.body.userIdd;
    const commentId = req.params.commentId;
    try {
        const currentComment = yield commentModel_1.default.findById(commentId);
        if (!currentComment) {
            return res.json({ message: "comment not found", success: false });
        }
        const replyComment = new commentReplyModel_1.default({
            userId,
            commentId,
            comment,
        });
        yield replyComment.save();
        yield userModel_1.default.populate(replyComment, {
            path: "userId",
            select: { firstName: 1, lastName: 1, profileImage: 1 },
        });
        console.log(replyComment, "postcomment aafter populate");
        res.json({ message: 'comment reply posted successfully', success: true, replyComment: replyComment });
    }
    catch (error) {
        console.log(error);
    }
});
exports.postCommentReply = postCommentReply;
const getAllCommentReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params, "endayaluym iviada etheeknn reply commetybackinokkam");
    const commentId = req.params.commentId;
    try {
        const commentsReplies = yield commentReplyModel_1.default.aggregate([
            {
                $match: {
                    commentId: new mongoose_1.default.Types.ObjectId(commentId),
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
                    "author.profileImage": 1,
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
        return res.json({ message: "commentreplies fetched successfully", commentsReplies: commentsReplies, success: true });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getAllCommentReply = getAllCommentReply;
const likeComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.commentId;
    const userId = req.body.userIdd;
    try {
        const comment = yield commentModel_1.default.findById(id);
        if (!comment) {
            return res.json({ message: "post not found", success: false });
        }
        if (!comment.likes.includes(userId)) {
            console.log(comment, "ithall likepost");
            yield comment.updateOne({ $push: { likes: userId } });
            return res.json({ message: "post liked successfully", success: true });
        }
        else {
            yield comment.updateOne({ $pull: { likes: userId } });
            return res.json({ message: "post disliked successfully", success: true });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.likeComment = likeComment;
