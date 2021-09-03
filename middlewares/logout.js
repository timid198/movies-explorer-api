module.exports = (req, res) => {
  console.log('yes');
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
  return res.status(200);
};
