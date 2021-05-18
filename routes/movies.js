const router = require('express').Router();
const {
  validateAuthDate,
  validateMoviesData,
  validateMovieId,
} = require('../middlewares/validations');
const auth = require('../middlewares/auth');
const {
  createMovie,
  getMovies,
  deleteMovie,
} = require('../controllers/movies');

router.use(validateAuthDate, auth);

router.post('/movies', validateMoviesData, createMovie);
router.get('/movies', getMovies); //Нет данных от пользователя для валидации
router.delete('/movies/:movieId', validateMovieId, deleteMovie);

module.exports = router;
