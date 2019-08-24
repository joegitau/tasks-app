const validator = require("validator");
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
  }
});

// Tasks model
const Task = mongoose.model("Task", tasksSchema);

// async function createTask(description, isComplete) {
//    let task = new Task({
//       description,
//       isComplete
//    });
//    task = await task.save();
//    console.log(task);
// }

// createTask('Dinner with wife', false);

module.exports = Task;
