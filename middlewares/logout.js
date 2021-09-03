module.exports = (req, res) => {
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
  return res.status(200).send();
};
