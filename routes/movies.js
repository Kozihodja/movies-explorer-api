const router = require('express').Router();
const {
  validateAuthDate,
} = require('../middlewares/validations');
const auth = require('../middlewares/auth');
const {
  createMovie,
  getMovies,
  deleteMovie,
} = require('../controllers/movies');

router.use(validateAuthDate, auth);

router.post('/movies', createMovie);
router.get('/movies', getMovies);
router.delete('/movies/:movieId', deleteMovie);

module.exports = router;
