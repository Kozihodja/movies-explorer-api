const router = require('express').Router();
const {
  validateUsersData,
  validateCreateUserData,
  validateUpdatedUsersInfo,
} = require('../middlewares/validations');
const auth = require('../middlewares/auth');
const {
  login,
  createUser,
  getUser,
  updateUser,
} = require('../controllers/users');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.post('/signin', validateUsersData, login);
router.post('/signup', validateCreateUserData, createUser);

router.use(auth);

router.get('/users/me/', getUser);
router.patch('/users/me', validateUpdatedUsersInfo, updateUser);

module.exports = router;
