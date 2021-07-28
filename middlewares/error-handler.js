/* eslint-disable no-console */
module.exports = (err, req, res, next) => {
  console.log(err);
  // console.log(req);
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка.'
        : message,
    });
  next();
};
