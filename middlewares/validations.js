const { celebrate, Joi } = require('celebrate');
// const { ObjectId } = require('mongoose').Types;
// const validator = require('validator');

module.exports.validateAuthDate = celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(),
});

module.exports.validateUsersData = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().case('lower'),
    password: Joi.string()
      .required(/(?=^.{6,}$)(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9]).*/),
  }),
});

module.exports.validateUpdatedUsersInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email().case('lower'),
  }),
});

module.exports.validateCreateUserData = celebrate({
  body: Joi.object().keys({
    email: Joi.string().case('lower').email().required(),
    password: Joi.string().required().pattern(/(?=^.{6,}$)(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9]).*/),
    name: Joi.string().min(2).max(30),
  }),
});
