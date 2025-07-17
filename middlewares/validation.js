const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateSignup = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().uri(),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    imageUrl: Joi.string().required().uri(),
    weather: Joi.string().required().valid("hot", "warm", "cold"),
  }),
});

const validateUserProfile = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string().min(2).max(30),
      avatar: Joi.string().uri(),
    })
    .or("name", "avatar"),
});

const validateItemId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().required().hex().length(24),
  }),
});

exports.validateSignup = validateSignup;
exports.validateLogin = validateLogin;
exports.validateItem = validateItem;
exports.validateUserProfile = validateUserProfile;
exports.validateItemId = validateItemId;
exports.celebrate = celebrate;
