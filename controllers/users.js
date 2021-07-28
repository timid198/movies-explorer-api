const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const BadRequestError = require('../errors/bad-request-err');
const AuthorizedButForbiddenError = require('../errors/authorized-but-forbidden-err');
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
          if (err.name === 'ValidationError') {
            throw new BadRequestError('Переданы некорректные данные в метод создания пользователя.');
          }
          if (err.name === 'MongoError' && err.code === 11000) {
            throw new ConflictError('Адрес электронной почты уже используется.');
          }
        }))
      .catch(next);
  },

  getUserById(req, res, next) {
    const authUser = req.user._id;
    User.findById(authUser)
      .then((user) => {
        if (!user) {
          throw new NotFoundError('Пользователь не найден.');
        }
        if (`${user._id}` === `${authUser}`) {
          res.send({ email: user.email, name: user.name });
        }
        throw new AuthorizedButForbiddenError('Вы не авторизованы.');
      })
      .catch((err) => {
        if (err.statusCode === 404 || err.statusCode === 403) {
          throw err;
        }
        if (err.name === 'CastError') {
          throw new BadRequestError('Переданы некорректные данные в метод создания пользователя.');
        }
      })
      .catch(next);
  },

  updateUserProfile(req, res, next) {
    const { name, email } = req.body;
    if (req.body.name && req.body.email) {
      User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
        .then((user) => {
          if (!user) {
            throw new NotFoundError('Пользователь не найден.');
          }
          res.send({ email: user.email, name: user.name });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            throw new BadRequestError('Переданы некорректные данные в метод создания пользователя.');
          }
          if (err.name === 'CastError') {
            throw new BadRequestError('Переданы некорректные данные.');
          }
        })
        .catch(next);
    } else {
      throw new BadRequestError('Переданы некорректные данные.');
    }
  },

  findAuthorized(req, res, next) {
    const { email } = req.user.email;
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          throw new NotFoundError('Пользователь не найден.');
        }
        res.send({ email: user.email, name: user.name });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw new BadRequestError('Переданы некорректные данные в метод изменения аватара.');
        }
        if (err.name === 'CastError') {
          throw new BadRequestError('Переданы некорректные данные.');
        }
      })
      .catch(next);
  },

  login(req, res, next) {
    const { email, password } = req.body;
    return User.findUserByCredentials({ email, password })
      .then((user) => {
        const token = jwt.sign({ _id: user._id, email }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
        res
          .cookie('jwt', token, {
            httpOnly: true,
          })
          .send({ message: `Аутентификация прошла успешно. Добро пожаловать, ${user.name}!` });
      })
      .catch(() => { throw new UnauthorizedError('Неправильные почта или пароль'); })
      .catch(next);
  },
};
