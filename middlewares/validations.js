const { celebrate, Joi } = require('celebrate');
const { ObjectId } = require('mongoose').Types;
const validator = require('validator');

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
    name: Joi.string().required().min(2).max(30),
  }),
});

module.exports.validateMoviesData = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.number()
      .integer()
      .required()
      .min(1888)
      .max(9999),
    description: Joi.string().required(),
    image: Joi.string().custom((value, helpers) => {
      if (validator.isURL(value, { protocols: ['http', 'https'], require_protocol: true })) {
        return value;
      }
      return helpers.message('Поле должно быть валидным url-адресом');
    })
      .messages({
        'any.required': 'Поле "image" должно быть заполнено',
      }),
    trailer: Joi.string().custom((value, helpers) => {
      if (validator.isURL(value, { protocols: ['http', 'https'], require_protocol: true })) {
        return value;
      }
      return helpers.message('Поле должно быть валидным url-адресом');
    })
      .messages({
        'any.required': 'Поле "trailer" должно быть заполнено',
      }),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().custom((value, helpers) => {
      if (validator.isURL(value, { protocols: ['http', 'https'], require_protocol: true })) {
        return value;
      }
      return helpers.message('Поле должно быть валидным url-адресом');
    })
      .messages({
        'any.required': 'Поле "thumbnail" должно быть заполнено',
      }),
    movieId: Joi.number().required(),
  }),
});

module.exports.validateMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (ObjectId.isValid(value)) {
          return value;
        }
        return helpers.message('Невалидный id');
      }),
  }),
});
