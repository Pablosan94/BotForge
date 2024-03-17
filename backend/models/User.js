const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
  },
  password: {
    type: String,
    validate: {
      validator: (value) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);
      },
      message: 'The password must be at least 8 characters long and contain at least one uppercase and one digit'
    },    
    required: [true, 'Please provide a password'],    
  },
});

UserSchema.plugin(uniqueValidator);

UserSchema.pre('save', function (next) {
  const user = this;

  bcrypt.hash(user.password, 10, (error, hash) => {
    user.password = hash;
    next();
  });
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
