const { isCelebrateError } = require('celebrate');
const BadRequestError = require('./bad-request-err');

const celebrateError = (err, req, res, next) => {
  console.log(err);
  if (isCelebrateError(err)) {
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
