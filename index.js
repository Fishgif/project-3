const express = require("express");
const app = express()

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")
const postRoute = require("./routes/posts")
// const multer = require("multer");

dotenv.config();
// Created Connection
mongoose.connect(
    process.env.MONGODB_URI || process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
      console.log("Connected to MongoDB");
    }
  );

//   Middleware
app.use(express.json());
app.use(helmet({
  crossOriginEmbeddedPolicy: false
}));


app.use(morgan("common"));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);


const PORT = process.env.PORT || 8800;

app.listen(prompt, ()=>{
    console.log("Server is running")
})
