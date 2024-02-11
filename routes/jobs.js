const Job = require("../models/Job");

const router = require("express").Router();

//add job

router.post("/", async (req, res) => {
  const newJob = new Job(req.body);
  try {
    const savedJob = await newJob.save();
    res.status(200).json(savedJob);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get jobs

router.get("/:userId", async (req, res) => {
  try {
    const messages = await Job.find({
      userId: req.params.userId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all jobs

router.get("/get", (req, res) => {
    Job.find()
      .then((users) => {
        res.status(200).json({
          status: true,
          message: "users fetched successfully!",
          data: users,
        });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  });
  

// get jobs by profile
router.get("/jobsByProfile", async (req, res) => {
    try {
        const messages = await Job.find({
          profile: req.body.profile,
        });
        console.log(messages)
        res.status(200).json(messages);
      } catch (err) {
        res.status(500).json(err);
      }
  });
  


//apply for a job

// get all applicants
module.exports = router;
