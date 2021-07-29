const { Joi, celebrate } = require('celebrate');
const validator = require('validator');

const validateNumId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().custom((value, helpers) => {
      if (validator.isNumeric(value)) {
        return value;
      }
      return helpers.message('Невалидный id');
    }),
  }),
});

const validateCreateUserBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Неправильная электронная почта.');
    })
      .messages({ 'string.required': 'Поле "email" должно быть заполнено.' }),
    password: Joi.string().required().min(8).messages({
      'string.min': 'Минимальная длина поля "password" - 8',
      'string.required': 'Поле "password" должно быть заполнено',
    }),
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина поля "name" - 2',
        'string.max': 'Максимальная длина поля "name" - 30',
        'string.required': 'Поле "name" должно быть заполнено',
      }),
  }),
});

const validateUserBodyLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Неправильная электронная почта.');
    })
      .messages({ 'string.required': 'Поле "email" должно быть заполнено.' }),
    password: Joi.string().required().min(8)
      .messages({
        'string.min': 'Минимальная длина поля "password" - 8',
        'string.required': 'Поле "password" должно быть заполнено',
      }),
  }),
});

const validateUserBodyUpdate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Неправильная электронная почта.');
    })
      .messages({ 'string.required': 'Поле "email" должно быть заполнено.' }),
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина поля "name" - 2',
        'string.max': 'Максимальная длина поля "name" - 30',
        'string.required': 'Поле "name" должно быть заполнено',
      }),
  }),
});

const validateMovieCreateBody = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().messages({ 'string.required': 'Поле "country" должно быть заполнено' }),
    director: Joi.string().required().messages({ 'string.required': 'Поле "director" должно быть заполнено' }),
    duration: Joi.number().required().messages({
      'number.required': 'Поле "duration" должно быть заполнено',
      'number.base': 'Поле "duration" должно быть числом.',
    }),
    year: Joi.string().required().messages({ 'string.required': 'Поле "year" должно быть заполнено' }),
    description: Joi.string().required().messages({ 'string.required': 'Поле "description" должно быть заполнено' }),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Неправильная ссылка.');
    })
      .messages({ 'string.required': 'Поле "image" должно быть заполнено.' }),
    trailer: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Неправильная ссылка.');
    })
      .messages({ 'string.required': 'Поле "trailer" должно быть заполнено.' }),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Неправильная ссылка.');
    })
      .messages({ 'string.required': 'Поле "thumbnail" должно быть заполнено.' }),
    movieId: Joi.number().required().messages({ 'number.required': 'Поле "movieId" должно быть заполнено' }),
    nameRU: Joi.string().required().messages({ 'string.required': 'Поле "nameRU" должно быть заполнено' }),
    nameEN: Joi.string().required().messages({ 'string.required': 'Поле "nameRU" должно быть заполнено' }),
  }),
});

module.exports = {
  validateNumId,
  validateCreateUserBody,
  validateUserBodyLogin,
  validateUserBodyUpdate,
  validateMovieCreateBody,
};
