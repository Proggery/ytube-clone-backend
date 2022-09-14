import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

export const getVideo = async (req, res, next) => {
  try {
    const id = req.params.id;
    const video = await Video.findById(id);
    res.status(200).json(video);
  } catch (error) {
    next(error);
  }
};
export const addVideo = async (req, res, next) => {
  const newVideo = new Video({ userId: req.user.id, ...req.body });

  try {
    const savedVideo = await newVideo.save();
    res.status(200).json(savedVideo);
  } catch (error) {
    next(error);
  }
};
export const updateVideo = async (req, res, next) => {
  try {
    const id = req.params.id;
    const video = await Video.findById(id);
    if (!video) return next(createError(404, "Nincs ilyen videó!"));
    
    if (req.user.id === video.userId) {
      const update = await Video.findByIdAndUpdate(
        id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(update);
    } else {
      return next(createError(403, "Nem lehet módosítani a videót!"));
    }
  } catch (error) {
    next(error);
  }
};
export const deleteVideo = async (req, res, next) => {
  try {
    const id = req.params.id;

    const video = await Video.findById(id);
    if (!video) return next(createError(404, "Nincs ilyen videó!"));
    if (req.user.id === video.userId) {
      await Video.findByIdAndDelete(id);
      res.status(200).json("Videó törölve!");
    } else {
      return next(createError(403, "Videó törlése sikertelen!"))
    }
  } catch (error) {
    next(error);
  }
};
export const addView = async (req, res, next) => {
  try {
    const id = req.params.id;
    await Video.findByIdAndUpdate(id, {
      $inc: { views: 1 },
    });
    res.status(200).json("A nézet megváltozott!");
  } catch (error) {
    next(error);
  }
};
export const random = async (req, res, next) => {
  try {
    const videos = await Video.aggregate([{ $sample: { size: 40 } }]);
    res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};
export const trend = async (req, res, next) => {
  try {
    const videos = await Video.find().sort({ views: -1 });
    res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};
export const sub = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const subscribedChannels = user.subscribedUsers;

    const list = await Promise.all(
      subscribedChannels.map((channelId) => {
        return Video.find({ userId: channelId });
      })
    );

    res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (error) {
    next(error);
  }
};
export const tags = async (req, res, next) => {
  const tags = req.query.tags.split(",");

  try {
    const videos = await Video.find({ tags: { $in: tags } }).limit(20);
    res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};
export const search = async (req, res, next) => {
  const query = req.query.q;
  try {
    const videos = await Video.find({
      title: { $regex: query, $options: "i" },
    }).limit(40);
    res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};
