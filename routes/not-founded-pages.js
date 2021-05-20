const router = require('express').Router();

const { NotFoundedError } = require('../requestErrors/NotFoundedError');

router.use('*', (req, res, next) => {
  next(new NotFoundedError('Ресурс не найден.'));
});

module.exports = router;
