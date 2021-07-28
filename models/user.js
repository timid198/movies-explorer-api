const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const UnauthorizedError = require('../errors/unauthorized-err');

const { AUTHORIZATION_FAIL_MESSAGE } = require('../utils/messages');

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
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  { email, password },
  next,
) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError(AUTHORIZATION_FAIL_MESSAGE);
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new UnauthorizedError(AUTHORIZATION_FAIL_MESSAGE);
        }
        return user;
      });
    })
    .catch(next);
};

module.exports = mongoose.model('user', userSchema);
