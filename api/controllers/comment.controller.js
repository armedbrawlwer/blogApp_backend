import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";

export const createComment = async (req, res, next) => {
  try {
    //fetch data from user body
    const { userId, postId, content } = req.body;
    if (userId !== req.user.id) {
      next(errorHandler(400, 'you are not allowed to comment '))
    }

    const newComment = new Comment({
      content,
      userId,
      postId,
    })
    await newComment.save()

    return res.status(200).json(newComment)

  }
  catch (e) {
    next(e)
  }
}

export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .sort({ createdAt: -1 })

    return res.status(200).json(comments)
  }
  catch (e) {
    next(e)
  }
}

export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, 'Comment not found'));
    }
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId)
    if (!comment) {
      return next(errorHandler(404, "comment not found"))
    }
    if (comment.userId !== req.user.id && req.user.isAdmin == false) {
      return next(errorHandler(500, "not allowed to edit the post"))
    }

    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId, {
      content: req.body.content
    }, { new: true }
    )

    return res.status(200).json(editedComment)
  } catch (e) {
    next(e)
  }
}

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId)
    if (!comment) {
      return next(errorHandler(404, "comment not found"))
    }
    if (comment.userId !== req.user.id && req.user.isAdmin == false) {
      return next(errorHandler(500, "not allowed to delete the post"))
    }
    await Comment.findByIdAndDelete(req.params.commentId)
    res.status(200).json('comment has been deleted')
  } catch (e) {
    next(e)
  }
}

export const getComments = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(500, "not allowed to accesss comments"))
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'desc' ? -1 : 1;
    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit)

    const totalComments = await Comment.countDocuments()
    const now = new Date()
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    )

    const lastMonthComments = await Comment.countDocuments({ createdAt: { $gte: oneMonthAgo } })

    return res.status(200).json({comments,totalComments,lastMonthComments})

  } catch (e) {
    next(e)
  }
}