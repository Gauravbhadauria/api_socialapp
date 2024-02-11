 const express = require("express");
const app = express();

const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const helmet = require("helmet");
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/posts");
const commentRouter = require("./routes/comments");
const conversationRoute=require("./routes/conversations")
const messageRoute=require("./routes/messages")
const jobRouter=require("./routes/jobs")
dotenv.config();

mongoose
  .connect("mongodb+srv://gauravofficial2023:8raaDzIidfxMJUza@cluster0.5clbczd.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("mongo db database connected");
  });

//middleware

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
//app.use("/uploads", express.static("uploads"));
//http://localhost:8200/uploads/1699628599163_myecom.png
app.use("/socialapp/api/users", userRouter);
app.use("/socialapp/api/auth", authRouter);
app.use("/socialapp/api/post", postRouter);
app.use("/socialapp/api/post/comment", commentRouter);
app.use("/socialapp/api/conversations", conversationRoute);
app.use("/socialapp/api/messages", messageRoute);
app.use("/socialapp/api/jobs", jobRouter)
const PORT=process.env.PORT || 8383
app.listen(PORT, () => {
  console.log("app is running on " + PORT);
});
