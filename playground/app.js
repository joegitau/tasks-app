// const express = require('express');
// const validator = require('validator');
// const mongoose = require('mongoose');


// const app = express();

// mongoose.connect('mongodb://localhost/tasks', { useNewUrlParser: true, useCreateIndex: true })
//    .then( () => console.log('connected to MongoDB...') )
//    .catch( err => console.error(err, 'Cannot connect to MongoDB...'));

// // User
// // user schema
// const userSchema = new mongoose.Schema({
//    name: { type: String, required: true, trim: true  },
//    age: { type: Number, default: 0, validate(v) { if (v < 0 ) return 'Age must be a positive integer' }},
//    email: {
//       type: String,
//       required: true,
//       validate(v) {
//          if(!validator.isEmail(v)) {
//             throw new Error('Email is invalid')
//          }
//       }
//    },
//    password: {
//       type: String,
//       required: true,
//       trim: true,
//       minlength: 6,
//       validate(v) {
//          if (v.toLowerCase().includes('password')) {
//             throw new Error('Please try using another password')
//          }
//       }
//    }
// });

// // user model
// const User = mongoose.model('User', userSchema);

// async function createUser(name, age, email, password) {
//    try{
//       let user = new User({ name, age, email, password });
//       user = await user.save()
//       console.log(user)
//    } catch(err) {
//       console.error(err, 'Cannot create user!')
//    }
   
// }

// // createUser('Gladys', 32, 'joe@joe.com', 'password');

// // Tasks
// // create tasks schema
// const tasksSchema = new mongoose.Schema({
//    description: { type: String, required: true, trim: true },
//    isCompleted: {  type: Boolean, default: false }
// });

// // create tasks model
// const Task = mongoose.model('Task', tasksSchema);

// async function createTask(description, isCompleted) {
//    let task = new Task({ description, isCompleted });
//    task = await task.save();
//    console.log(task);
// }

// createTask('Dinner with wife', false );



