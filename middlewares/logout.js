module.exports = (req, res) => {
  res.clearCookie('jwt');
  return res.status(200).redirect('/signin');
};
