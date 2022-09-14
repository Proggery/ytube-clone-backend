import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import cors from require("cors");
// const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 5555;

app.use(cors());
// app.use(bodyParser());
// app.use(express.urlencoded({ extended: true }));

// Routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import videoRoutes from "./routes/videos.js";
import commentRoutes from "./routes/comments.js";

dotenv.config();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested, Content-Type, Accept Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "POST, PUT, PATCH, GET, DELETE");
    return res.status(200).json({});
  }
  next();
});

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

app.get("/", (req, res) => {
  res.send("siker még még");
});

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
