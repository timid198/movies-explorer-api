module.exports = (req, res) => {
  res.clearCookie('jwt');
  return res.status(200).message('Выход выполнен');
};
