const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const {
  BAD_REQUEST_MESSAGE, CAST_ERROR, VALIDATION_ERROR, MONGO_ERR_CODE,
  MONGO_ERROR, CONFLICT_MESSAGE, NOT_FOUND_MESSAGE, UNAUTHORIZED_MESSAGE, UNAUTHORIZED_CODE,
  AUTHORIZATION_FAIL_MESSAGE, AUTH_SUCCESS,
} = require('../utils/messages');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');

module.exports = {
  createUser(req, res, next) {
    const {
      email, password, name,
    } = req.body;
    bcrypt.hash(password, 9)
      .then((hash) => User.create({
        email, password: hash, name,
      })
        .then((user) => res.send({ email: user.email, name: user.name }))
        .catch((err) => {
          if (err.name === VALIDATION_ERROR) {
            throw new BadRequestError(BAD_REQUEST_MESSAGE);
          }
          if (err.name === MONGO_ERROR && err.code === MONGO_ERR_CODE) {
            throw new ConflictError(CONFLICT_MESSAGE);
          }
          throw err;
        }))
      .catch(next);
  },

  getUserById(req, res, next) {
    const authUser = req.user._id;
    User.findById(authUser)
      .then((user) => {
        if (!user) {
          throw new NotFoundError(NOT_FOUND_MESSAGE);
        }
        if (`${user._id}` === `${authUser}`) {
          res.send({ email: user.email, name: user.name, _id: user._id });
        }
        throw new ForbiddenError(UNAUTHORIZED_MESSAGE);
      })
      .catch((err) => {
        if (err.name === CAST_ERROR) {
          throw new BadRequestError(BAD_REQUEST_MESSAGE);
        }
        throw err;
      })
      .catch(next);
  },

  updateUserProfile(req, res, next) {
    const { name, email } = req.body;
    if (req.body.name && req.body.email) {
      User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
        .then((user) => {
          if (!user) {
            throw new NotFoundError(NOT_FOUND_MESSAGE);
          }
          res.send({ email: user.email, name: user.name });
        })
        .catch((err) => {
          if (err.name === VALIDATION_ERROR) {
            throw new BadRequestError(BAD_REQUEST_MESSAGE);
          }
          if (err.name === CAST_ERROR) {
            throw new BadRequestError(BAD_REQUEST_MESSAGE);
          }
          if (err.name === MONGO_ERROR && err.code === MONGO_ERR_CODE) {
            throw new ConflictError(CONFLICT_MESSAGE);
          }
          throw err;
        })
        .catch(next);
    } else {
      throw new BadRequestError(BAD_REQUEST_MESSAGE);
    }
  },

  findAuthorized(req, res, next) {
    const { email } = req.user.email;
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          throw new NotFoundError(NOT_FOUND_MESSAGE);
        }
        res.send({ email: user.email, name: user.name });
      })
      .catch((err) => {
        if (err.name === VALIDATION_ERROR) {
          throw new BadRequestError(BAD_REQUEST_MESSAGE);
        }
        if (err.name === CAST_ERROR) {
          throw new BadRequestError(BAD_REQUEST_MESSAGE);
        }
        throw err;
      })
      .catch(next);
  },

  login(req, res, next) {
    const { email, password } = req.body;
    return User.findUserByCredentials({ email, password })
      .then((user) => {
        const token = jwt.sign({ _id: user._id, email }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: 86400 * 7 });
        res
          .cookie('jwt', token, {
            maxAge: 3600000,
            httpOnly: true,
          })
          .send({ message: AUTH_SUCCESS(user) });
      })
      .catch((err) => {
        if (err.name === UNAUTHORIZED_CODE) {
          throw new UnauthorizedError(AUTHORIZATION_FAIL_MESSAGE);
        }
        throw err;
      })
      .catch(next);
  },
};
