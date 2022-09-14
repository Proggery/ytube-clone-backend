import { createError } from "../error.js";
import Comment from "../models/Comment.js";
import Video from "../models/Video.js";

export const getComments = async (req, res, next) => {
  const { videoId } = req.params;
  try {
    const comments = await Comment.find({ videoId: videoId });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};
export const addComment = async (req, res, next) => {
  const newComment = new Comment({ ...req.body, userId: req.user.id });
  try {
    const savedComment = await newComment.save();
    res.status(200).send(savedComment);
  } catch (error) {
    next(error);
  }
};
export const deleteComment = async (req, res, next) => {
  const id = req.params.id;

  try {
    const comment = await Comment.findById(id);
    const video = await Video.findById(id);

    if (req.user.id === comment.userId || req.user.id === video.userId) {
      await Comment.findByIdAndDelete(id);
      res.status(200).json("Komment törölve!");
    } else {
      return next(createError(403, "Komment törlése sikertelen!"));
    }
  } catch (error) {
    next(error);
  }
};
