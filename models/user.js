const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
const validator = require('validator');

// const UnauthorizedError = require('../errors/unauthorized-err');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: '{value} некорректная электронная почта.',
    },
  },
  password: {
    type: String,
    required: true,
    select: true,
    minlength: 8,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
});

module.exports = mongoose.model('user', userSchema);
