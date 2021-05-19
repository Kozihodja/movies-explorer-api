require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');
const { NotFoundedError } = require('./requestErrors/NotFoundedError');
const { PORT_CONFIG, MONGODB_CONFIG } = require('./config');

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

app.use('*', (req, res, next) => {
  next(new NotFoundedError('Ресурс не найден.'));
});

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    // проверяем статус и выставляем сообщение в зависимости от него
    message: statusCode === 500 ? `На сервере произошла ошибка ${err}, ${err.code}` : message,
  });
});

app.listen(NODE_ENV === 'production' ? PORT : PORT_CONFIG, () => {
});
