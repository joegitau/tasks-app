const mongoose = require("../db/mongoose");

// Tasks schema
const tasksSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  isComplete: {
    type: Boolean,
    default: false
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  }
});

// Tasks model
const Task = mongoose.model("Task", tasksSchema);

module.exports = Task;
