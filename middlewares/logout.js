module.exports = (req, res) => {
  res.clearCookie('jwt').status(200).message('Выход выполнен');
};
