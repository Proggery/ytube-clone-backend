import express from "express";
import {
  deleteUser,
  dislike,
  getUser,
  like,
  subscribe,
  unsubscribe,
  updateUser,
  getAllUser
} from "../controllers/user.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

// GET all user
router.get("/find", getAllUser);
// GET user
router.get("/find/:id", getUser);
// UPDATE user
router.put("/:id", verifyToken, updateUser);
// DELETE user
router.delete("/:id", verifyToken, deleteUser);
// SUBSCRIBE a user
router.put("/sub/:id", verifyToken, subscribe);
// UNSUBSCRIBE a user
router.put("/unsub/:id", verifyToken, unsubscribe);
// LIKE a video
router.put("/like/:videoId", verifyToken, like);
// DISLIKE a video
router.put("/dislike/:videoId", verifyToken, dislike);

export default router;
