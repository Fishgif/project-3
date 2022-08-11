const express = require("express");
const app = express()

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")
const postRoute = require("./routes/posts")
const multer = require("multer");
const router = express.Router();
const path = require("path");

dotenv.config();
// Created Connection
mongoose.connect(
    process.env.MONGODB_URI || process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
      console.log("Connected to MongoDB");
    }
  );
  app.use("/images", express.static(path.join(__dirname, "public/images")));
//   Middleware
app.use(express.json());
app.use(helmet({
  crossOriginEmbeddedPolicy: false
}));
app.use(morgan("common"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
   
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("Image uploaded");
  } catch (error) {
    console.error(error);
  }
});
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);


const PORT = process.env.PORT || 8800;

app.listen(PORT, ()=>{
    console.log("Server is running")
})
