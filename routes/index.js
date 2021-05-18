const router = require('express').Router();

const usersRouter = require('./users');
const moviesRouter = require('./movies');

module.exports = router.use(usersRouter, moviesRouter);
