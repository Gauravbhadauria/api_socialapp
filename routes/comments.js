const Comment = require("../models/Comment");

const router = require("express").Router();

//add comment

router.post("/add", async (req, res) => {
  try {
    const newComment = new Comment({
      comment: req.body.comment,
      userId: req.body.userId,
      postId: req.body.postId,
      username: req.body.username,
    });
    await newComment.save();
    res
      .status(200)
      .json({ status: true, message: "comment added successfullY" });
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete comment

router.delete("/delete/:id", async (req, res) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.id });
    if (comment) {
      Comment.findOneAndDelete({ _id: req.params.id })
        .then(() => {
          res
            .status(200)
            .json({ status: true, message: "comment deleted successfully" });
        })
        .catch((err) => {
          res.status(201).json(err);
        });
    } else {
      res.status(201).json({ status: false, message: "no comment found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all comment by post

router.get("/get/:id", (req, res) => {
  try {
    Comment.find({ postId: req.params.id })
      .then((comments) => {
        res.status(200).json({
          status: true,
          message: "comments fetched successfully!",
          data: comments,
        });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } catch (err) {
    res.status(500).json(err);
  }
});

//update comment

router.put("/update/:id", async (req, res) => {
  try {
    Comment.findOneAndUpdate({ _id: req.params.id }, { $set: req.body })
      .then(() => {
        res.status(200).json({
          status: true,
          message: "comment  updated successfully!",
        });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
