const Movie = require('../models/movie');
const {
  ValidationError,
} = require('../requestErrors/ValidationError');
const {
  DeleteCardError,
} = require('../requestErrors/DeleteCardError');
const {
  CastError,
} = require('../requestErrors/CastError');
const {
  NotFoundedError,
} = require('../requestErrors/NotFoundedError');

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    // вернём записанные в базу данные
    .then((movie) => res.json({ movie }))
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new ValidationError(
          'Переданы некорректные данные при создании карточки.',
        );
        next(error);
      } else {
        next(err);
      }
    });
};

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movie) => res.json({ movie }))
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new CastError('Не верный формат переданных данных.');
        next(error);
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFoundedError('Запрашиваемая запись не найдена.');
    })
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        const err = new DeleteCardError('Вы не можете удалить чужую запись');
        next(err);
      } else {
        Movie.findByIdAndRemove(req.params.movieId).orFail(() => {
          throw new NotFoundedError('Запрашиваемая запись не найдена.');
        }).then((deletedMovie) => {
          res.json(deletedMovie);
        }).catch((err) => {
          if (err.name === 'CastError') {
            const error = new CastError('Не верный формат переданных данных.');
            next(error);
          } else {
            next(err);
          }
        });
      }
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
