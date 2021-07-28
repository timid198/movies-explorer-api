require('dotenv').config();
const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');

const { createUser, login } = require('../controllers/users');
const { validateCreateUserBody, validateUserBodyLogin } = require('../middlewares/validation');
const NotFoundError = require('../errors/not-found-err');

const logout = require('../middlewares/logout');

router.post('/signup', validateCreateUserBody, createUser);
router.post('/signin', validateUserBodyLogin, login);
router.use(auth);
router.use('/', userRouter);
router.use('/', movieRouter);
router.post('/signout', logout);
router.use(() => { throw new NotFoundError('Ресурс не найден.'); });

module.exports = router;
