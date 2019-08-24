const validator = require('validator');
const mongoose = require('../db/mongoose');

// user schema
const userSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      trim: true
   },
   age: {
      type: Number,
      default: 0,
      validate(v) {
         if (v < 0) {
            throw new Error('Age must be a positive integer')
         }
      }
   }, 
   email: {
      type: String,
      required: true,
      validate(v) {
         if (!validator.isEmail(v)) {
            throw new Error('Email is invalid')
         }
      }
   },
   password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      validate(v) {
         if (v.toLowerCase().includes('password')) {
            throw new Error('Please try using another password')
         }
      }
   }
});

// user model
const User = mongoose.model('User', userSchema);

// async function createUser(name, age, email, password) {
//    try {
//       let user = new User({
//          name,
//          age,
//          email,
//          password
//       });
//       user = await user.save()
//       console.log(user)
//    } catch (err) {
//       console.error(err, 'Cannot create user!')
//    }
// }

// createUser();

module.exports = User;
