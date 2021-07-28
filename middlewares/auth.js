const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const { UNAUTHORIZED_MESSAGE } = require('../utils/messages');
const UnauthorizedError = require('../errors/unauthorized-err');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  // eslint-disable-next-line no-console
  // console.log(req.cookies.jwt);
  if (!token) {
    throw new UnauthorizedError(UNAUTHORIZED_MESSAGE);
  }
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new UnauthorizedError(UNAUTHORIZED_MESSAGE);
  }

  req.user = payload;
  next();
  return true;
};
