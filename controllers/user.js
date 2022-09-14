import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

export const getAllUser = async (req, res, next) => {
  try {
    const user = await User.find();

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
export const getUser = async (req, res, next) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
export const updateUser = async (req, res, next) => {
  const id = req.params.id;
  if (id === req.user.id) {
    try {
      const update = await User.findByIdAndUpdate(
        id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(update);
    } catch (error) {
      next(error);
    }
  } else {
    return next(createError(403, "Nem lehet módosítani!"));
  }
};
export const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  if (id === req.user.id) {
    try {
      await User.findByIdAndDelete(id);
      res.status(200).json("Felhasználó törölve!");
    } catch (error) {
      next(error);
    }
  } else {
    return next(createError(403, "Felhasználó törlése sikertelen!"));
  }
};
export const subscribe = async (req, res, next) => {
  const id = req.params.id;
  
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $push: { subscribedUsers: id },
    });
    await User.findByIdAndUpdate(id, {
      $inc: { subscribers: 1 },
    });
    res.status(200).json("Sikeres feliratkozás!");
  } catch (error) {
    next(error);
  }
};
export const unsubscribe = async (req, res, next) => {
  const id = req.params.id;

  try {
    await User.findByIdAndUpdate(id, {
      $push: { subscribedUsers: id },
    });
    await User.findByIdAndUpdate(id, {
      $inc: { subscribers: -1 },
    });
    res.status(200).json("Sikeres leiratkozás!");
  } catch (error) {
    next(error);
  }
};
export const like = async (req, res, next) => {
  const userId = req.user.id;
  const videoId = req.params.videoId;

  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { likes: userId },
      $pull: { dislikes: userId },
    });
    res.status(200).json("Videó like-olva!");
  } catch (error) {
    next(error);
  }
};
export const dislike = async (req, res, next) => {
  const userId = req.user.id;
  const videoId = req.params.videoId;

  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { dislikes: userId },
      $pull: { likes: userId },
    });
    res.status(200).json("Videó dislike-olva!");
  } catch (error) {
    next(error);
  }
};
