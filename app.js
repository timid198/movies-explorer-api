require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const limiter = require('./ratelimit');
const routes = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const celebrateError = require('./errors/celebrate-error');
const errorHandler = require('./middlewares/error-handler');
const { PORT, MONGO_URL } = require('./utils/constants');

const app = express();

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(requestLogger);
app.use(helmet());
app.use(limiter);
app.use(cookieParser());
app.use(express.json());
app.use(routes);
app.use(errorLogger);
app.use(celebrateError);
app.use(errorHandler);

app.listen(PORT);
