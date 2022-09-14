import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"

// Routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import videoRoutes from "./routes/videos.js";
import commentRoutes from "./routes/comments.js";

const app = express();
const port = 5555;

dotenv.config();

const connect = () => {
  mongoose
    .connect(process.env.MONGO)
    .then(() => {
      console.log("Sikeres csatlakozás az adatbázishoz");
    })
    .catch((err) => {
      throw err;
    });
};

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Hiba!";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

app.listen(port, () => {
  connect();
  console.log(`A szerver fut: http://localhost:${port}`);
});
