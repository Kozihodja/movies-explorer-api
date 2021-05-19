const router = require('express').Router();
const {
  validateMoviesData,
  validateMovieId,
} = require('../middlewares/validations');
const auth = require('../middlewares/auth');
const {
  createMovie,
  getMovies,
  deleteMovie,
} = require('../controllers/movies');

router.use(auth);

router.post('/movies', validateMoviesData, createMovie);
router.get('/movies', getMovies);
router.delete('/movies/:movieId', validateMovieId, deleteMovie);

module.exports = router;
