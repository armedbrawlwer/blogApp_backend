import express from "express";
import { createPost, getPosts, deletePost,updatePost } from "../controllers/post.controller.js";
import { verifyToken } from "../utils/verifyUser.js"
const router = express.Router();

router.post('/createPost', verifyToken, createPost)
router.get('/getPosts', getPosts)
router.delete('/deletePost/:postId/:userId', verifyToken, deletePost)
router.put('/updatePost/:postId/:userId',verifyToken,updatePost)

export default router