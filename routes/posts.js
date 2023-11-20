const Post = require("../models/Post");

const router = require("express").Router();
const upload = require("../middleware/upload");
//const s3client = require("@aws-sdk/client-s3");
const putObjectCommand = require("@aws-sdk/client-s3");
const crypto = require("crypto");
const dotenv = require("dotenv");
const AWS = require("aws-sdk");

dotenv.config();

const randomImageName = () => crypto.randomBytes(16).toString("hex");

//middleware
const bucketName = "cyclic-bronze-lemming-fez-ap-south-1";
const bucketRegion = "ap-south-1";
const accessKey = "ASIAXGHFDILRGEKFIRKB";
const secretAccessKEy = "UC5RX0MgR0GkvkhE18RuhTSV0P4oXmJcONt9YxU";

router.post("/add", upload.single("imageUrl"), async (req, res) => {
  try {
    const newPost = new Post(req.body);
    console.log(req.file);
    if (req.file) {
      newPost.imageUrl = req.file.filename;
    }

    const s3 = new AWS.S3({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKEy,
      },
      region: bucketRegion,
    });
    const params = {
      Bucket: bucketName,
      Key: randomImageName(),
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };
    await s3.putObject(params).promise();

    // get it back
    let my_file = await s3
      .getObject({
        Bucket: bucketName,
        Key: randomImageName(),
      })
      .promise();

    console.log(JSON.parse(my_file));
    res.status(200).json(my_file);

    // const command = new putObjectCommand(params);
    // s3.send(command);

    // newPost
    //   .save()
    //   .then(() => {
    //     res
    //       .status(200)
    //       .json({ status: true, message: "post aded successfully !" });
    //   })
    //   .catch((err) => {
    //     res.status(500).json(err);
    //   });
  } catch (err) {
    res.status(500).json(err);
  }
});

//update post

router.put("/update/:id", async (req, res) => {
  try {
    Post.findOneAndUpdate({ _id: req.params.id }, { $set: req.body })
      .then(() => {
        res.status(200).json({
          status: true,
          message: "Post data updated successfully!",
        });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete post

router.delete("/delete/:id", async (req, res) => {
  try {
    const user = await Post.findOne({ _id: req.params.id });
    if (user) {
      Post.findByIdAndDelete({ _id: req.params.id }).then(() => {
        res.status(200).json({ status: true, message: "Post deleted " });
      });
    } else {
      res
        .status(200)
        .json({ status: false, message: "Post not found with this id" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get post details by id
router.get("/getPost/:id", async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    post &&
      res.status(200).json({
        status: true,
        message: "post fetched successfully!",
        data: post,
      });
    !post &&
      res.status(200).json({
        status: false,
        message: "post not found",
      });
  } catch (err) {
    res.status(500).json(err);
  }
});

// get all posts

router.get("/get", (req, res) => {
  Post.find()
    .then((posts) => {
      res.status(200).json({
        status: true,
        message: "posts fetched successfully!",
        data: posts,
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

//get all posts of any user

router.get("/get/:id", (req, res) => {
  try {
    Post.find({ userId: req.params.id })
      .then((posts) => {
        res.status(200).json({
          status: true,
          message: "posts fetched successfully!",
          data: posts,
        });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } catch (err) {
    res.status(500).json(err);
  }
});

//like post

router.put("/like/:id", async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    let isLiked = false;
    post.likes.map((item) => {
      if (item == req.body.userId) {
        isLiked = true;
      }
    });

    console.log(isLiked);
    if (isLiked) {
      const res1 = await Post.updateOne(
        { _id: req.params.id },
        { $pull: { likes: req.body.userId } }
      );

      res
        .status(200)
        .json({ status: true, message: " like  removed successfully" });
    } else {
      const res1 = await Post.updateOne(
        { _id: req.params.id },
        { $push: { likes: req.body.userId } }
      );
      res
        .status(200)
        .json({ status: true, message: " post liked  successfully" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
