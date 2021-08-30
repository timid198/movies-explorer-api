const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');
const logout = require('../middlewares/logout');

const { createUser, login } = require('../controllers/users');
const { validateCreateUserBody, validateUserBodyLogin } = require('../middlewares/validation');
const { NOT_FOUND_MESSAGE } = require('../utils/messages');
const NotFoundError = require('../errors/not-found-err');

router.post('/signup', validateCreateUserBody, createUser);
router.post('/signin', validateUserBodyLogin, login);
router.use(auth);
router.use('', userRouter);
router.use('', movieRouter);
router.post('/signout', logout);
router.use(() => { throw new NotFoundError(NOT_FOUND_MESSAGE); });

module.exports = router;
