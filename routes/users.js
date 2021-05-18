const router = require('express').Router();
const {
  validateAuthDate,
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

router.use(validateAuthDate, auth);

router.get('/users/me/', getUser); //Нет данных от пользователя для валидации
router.patch('/users/me', validateUpdatedUsersInfo, updateUser);

module.exports = router;
