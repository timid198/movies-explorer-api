const { isCelebrateError } = require('celebrate');
const BadRequestError = require('./bad-request-err');

const celebrateError = (err, req, res, next) => {
  console.log({ 1: err });
  if (isCelebrateError(err)) {
    console.log({ 2: err.details.get('body').message });
    throw new BadRequestError(err.details.get('body').message);
  }
  next(err);
};

module.exports = celebrateError;
