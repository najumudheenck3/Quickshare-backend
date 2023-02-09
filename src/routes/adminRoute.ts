import  express, { Router }  from "express";
const router:Router = express.Router();
import { changeUserStatus, fetDashboardDetails, getAllNotification, getAllUsers, loginAdmin } from "../controller/adminController";
import { getAllCommentReply, getAllPosts } from "../controller/commentController";
import { changePostStatus, getAllReportedPosts } from "../controller/postController";
import { getAllFollowers, getAllFollowing, getUserProfile } from "../controller/userController";
const authMiddeleware=require('../middleware/authMiddleware')


router.post('/login',loginAdmin)

router.get('/get-all-users',authMiddeleware,getAllUsers)

router.post('/change-user-status',authMiddeleware,changeUserStatus)

router.get('/get-all-reported-posts',authMiddeleware,getAllReportedPosts)

router.post('/change-post-status',authMiddeleware,changePostStatus)

router.get('/get-user-profile/:id',authMiddeleware,getUserProfile)

router.get('/all-comments/:postId',authMiddeleware,getAllPosts)

router.get('/all-comment-replies/:commentId',authMiddeleware,getAllCommentReply)

router.get('/get-all-followers/:userId',authMiddeleware,getAllFollowers)

router.get('/get-all-following/:userId',authMiddeleware,getAllFollowing)

router.get('/get-all-notifications',authMiddeleware,getAllNotification)

router.get('/get-details',authMiddeleware,fetDashboardDetails)

module.exports = router;
