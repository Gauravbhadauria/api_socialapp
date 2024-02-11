const mongoose = require("mongoose");
const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      max: 200,
    },
    userId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      //required: true,
    },
    company: {
      type: String,
     // required: true,
    },
    package: {
      type: String,
    //  required: true,
    },
    description: {
      type: String,
     // required: true,
    },
    profile:{
        type: String,
     //   required: true, 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
