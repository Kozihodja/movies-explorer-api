const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  ValidationError,
} = require('../requestErrors/ValidationError');
const {
  UsersError,
} = require('../requestErrors/UsersError');
const {
  CastError,
} = require('../requestErrors/CastError');
const {
  NotFoundedError,
} = require('../requestErrors/NotFoundedError');

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    // вернём записанные в базу данные
    .then((user) => {
      res.json({
        name: user.name,
        _id: user._id,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        const error = new UsersError('Пользователь существует');
        next(error);
      } else if (err.name === 'ValidationError') {
        const error = new ValidationError('Переданы некорректные данные при создании пользователя.');
        next(error);
      } else {
        next(err);
      }
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundedError('Пользователь по указанному _id не найден.');
    })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new CastError('Не верный формат переданных данных.');
        next(error);
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  // обновим имя найденного по _id пользователя
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
    },
  )
    .orFail(() => {
      throw new NotFoundedError('Пользователь по указанному _id не найден.');
    })
    .then((user) => res.json({ user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new CastError('Не верный формат переданных данных.');
        next(error);
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        {
          expiresIn: '7d',
        },
      );

      // вернём токен
      // res
      //   .cookie("jwt", token, {
      //     // token - наш JWT токен, который мы отправляем
      //     maxAge: 3600000,
      //     httpOnly: true,
      //   })
      //   .end();
      res.json({ token });
    })
    .catch(next);
};
