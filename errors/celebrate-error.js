const { isCelebrateError } = require('celebrate');
const BadRequestError = require('./bad-request-err');

const celebrateError = (err, req, res, next) => {
  console.log({ 1: err });
  if (isCelebrateError(err)) {
    console.log({ 2: err.details.get('params') });
    console.log({ 3: err.details.get('body') });
    if (err.details.get('params')) {
      throw new BadRequestError(err.details.get('params').message);
    }
    if (err.details.get('body')) {
      throw new BadRequestError(err.details.get('body').message);
    }
  }
  next(err);
};

module.exports = celebrateError;
