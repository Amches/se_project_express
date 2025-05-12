const User = require("../models/user");
const {
  BAD_REQUEST,
  CREATED,
  internalErrorHandler,
  SUCCESS,
  castErrorHandler,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(SUCCESS).send(users))
    .catch((err) => {
      internalErrorHandler(err, res);
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(CREATED).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return internalErrorHandler(err, res);
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(SUCCESS).send(user))
    .catch((err) => {
      castErrorHandler(err, res);
    });
};

module.exports = { getUsers, createUser, getUserById };
