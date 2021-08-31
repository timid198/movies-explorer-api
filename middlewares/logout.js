module.exports = (req, res) => {
  res.clearCookie('jwt');
  return res.send({ message: 'Выполнен выход из аккаунта' }).status(200).redirect('/');
};
