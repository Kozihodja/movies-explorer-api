require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');
const { PORT_CONFIG, MONGODB_CONFIG } = require('./config');
const errorHandler = require('./middlewares/error-handler');

const { NODE_ENV, PORT = 3000, MONGODB } = process.env;

const app = express();

// подключаемся к серверу mongo
mongoose.connect(NODE_ENV === 'production' ? MONGODB : MONGODB_CONFIG, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// подключаем мидлвары, роуты
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

app.use(router);

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());

app.use(errorHandler);

app.listen(NODE_ENV === 'production' ? PORT : PORT_CONFIG, () => {
});
