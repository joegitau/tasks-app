const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/tasks', {
      useNewUrlParser: true,
      useCreateIndex: true
   })
   .then(() => console.log('connected to MongoDB...'))
   .catch(err => console.error(err, 'Cannot connect to MongoDB...'));

module.exports = mongoose;