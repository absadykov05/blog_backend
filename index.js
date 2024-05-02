import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import {
  registerValidator,
  loginValidator,
  createPostValidator,
} from "./validations.js";
import { userController, postController } from "./controllers/index.js";
import { checkAuth, handleValidationErrors } from "./utils/index.js";

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

//authorization
app.post(
  "/auth/register",
  registerValidator,
  handleValidationErrors,
  userController.register
);
app.post(
  "/auth/login",
  loginValidator,
  handleValidationErrors,
  userController.login
);
app.get("/auth/me", checkAuth, userController.getMe);

app.post("/upload", upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/posts", postController.getAll);
app.get("/posts/:id", postController.getOne);
app.post("/posts", checkAuth, createPostValidator, postController.create);
app.delete("/posts/:id", checkAuth, postController.remove);
app.patch("/posts/:id", checkAuth, createPostValidator, postController.update);

app.get("/tags", postController.getLastTags);
app.get("/tags/:tag", postController.getOneTag);

app.get("/postsSorted", postController.getAllSorted);

app.patch("/addComment/:id", postController.comment);

app.listen(process.env.PORT || 3001, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});
