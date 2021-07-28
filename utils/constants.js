require('dotenv').config();

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

module.exports = {
  PORT,
  MONGO_URL,
};
