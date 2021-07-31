const { Joi, celebrate } = require('celebrate');
const { ObjectId } = require('mongoose').Types;
const validator = require('validator');

const {
  INVALID_ID, INVALID_EMAIL, EMAIL_REQUIRED, PASSWORD_MIN, PASSWORD_REQUIRED, NAME_MIN, NAME_MAX,
  NAME_REQUIRED, COUNTRY_REQUIRED, DIRECTOR_REQUIRED, DURATION_REQUIRED, DURATION_IS_NUMBER,
  YEAR_REQUIRED, DESCRIPTION_REQUIRED, NOT_VALID_LINK, IMAGE_REQUIRED, TRAILER_REQUIRED,
  THUMBNAIL_REQUIRED, MOVIEID_REQUIRED, MOVIEID_IS_NUMBER, NAMERU_REQUIRED, NAMEEN_REQUIRED,
} = require('../utils/messages');

const validateObjId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().custom((value, helpers) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message(INVALID_ID);
    }),
  }),
});

const validateCreateUserBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message(INVALID_EMAIL);
    })
      .messages({ 'string.required': EMAIL_REQUIRED }),
    password: Joi.string().required().min(8).messages({
      'string.min': PASSWORD_MIN,
      'string.required': PASSWORD_REQUIRED,
    }),
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': NAME_MIN,
        'string.max': NAME_MAX,
        'string.required': NAME_REQUIRED,
      }),
  }),
});

const validateUserBodyLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message(INVALID_EMAIL);
    })
      .messages({ 'string.required': EMAIL_REQUIRED }),
    password: Joi.string().required().min(8)
      .messages({
        'string.min': PASSWORD_MIN,
        'string.required': PASSWORD_REQUIRED,
      }),
  }),
});

const validateUserBodyUpdate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message(INVALID_EMAIL);
    })
      .messages({ 'string.required': EMAIL_REQUIRED }),
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': NAME_MIN,
        'string.max': NAME_MAX,
        'string.required': NAME_REQUIRED,
      }),
  }),
});

const validateMovieBody = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().messages({ 'string.required': COUNTRY_REQUIRED }),
    director: Joi.string().required().messages({ 'string.required': DIRECTOR_REQUIRED }),
    duration: Joi.number().required().messages({
      'number.required': DURATION_REQUIRED,
      'number.base': DURATION_IS_NUMBER,
    }),
    year: Joi.string().required().messages({ 'string.required': YEAR_REQUIRED }),
    description: Joi.string().required().messages({ 'string.required': DESCRIPTION_REQUIRED }),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message(NOT_VALID_LINK);
    })
      .messages({ 'string.required': IMAGE_REQUIRED }),
    trailer: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message(NOT_VALID_LINK);
    })
      .messages({ 'string.required': TRAILER_REQUIRED }),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message(NOT_VALID_LINK);
    })
      .messages({ 'string.required': THUMBNAIL_REQUIRED }),
    movieId: Joi.number().required().messages({ 'number.required': MOVIEID_REQUIRED, 'number.base': MOVIEID_IS_NUMBER }),
    nameRU: Joi.string().required().messages({ 'string.required': NAMERU_REQUIRED }),
    nameEN: Joi.string().required().messages({ 'string.required': NAMEEN_REQUIRED }),
  }),
});

module.exports = {
  validateObjId,
  validateCreateUserBody,
  validateUserBodyLogin,
  validateUserBodyUpdate,
  validateMovieBody,
};
