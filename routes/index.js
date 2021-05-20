const router = require('express').Router();

const usersRouter = require('./users');
const moviesRouter = require('./movies');
const notFoundedRouter = require('./not-founded-pages');

module.exports = router.use(usersRouter, moviesRouter, notFoundedRouter);
