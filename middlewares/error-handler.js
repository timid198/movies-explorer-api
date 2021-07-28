/* eslint-disable no-console */
const { SERVER_MESSAGE, SERVER_CODE } = require('../utils/messages');

module.exports = (err, req, res, next) => {
  console.log(err);
  // console.log(req);
  const { statusCode = SERVER_CODE, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === SERVER_CODE
        ? SERVER_MESSAGE
        : message,
    });
  next();
};
