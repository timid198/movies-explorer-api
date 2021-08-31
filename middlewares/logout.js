module.exports = (req, res) => {
  res.clearCookie('jwt');
  return res.status(200).message({ message: 'Выход выполнен' });
};
