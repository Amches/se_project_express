const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const { CREATED, SUCCESS } = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");

const BadRequestError = require("../errors/bad-request-error");
const NotFoundError = require("../errors/not-found-error");
const ConflictError = require("../errors/conflict-error");
const UnauthorizedError = require("../errors/unauthorized-error");
const ServerError = require("../errors/server-error");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const { password: _hashedPassword, ...userWithoutPass } = user.toObject();
      res.status(CREATED).send(userWithoutPass);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError({ message: err.message }));
      }
      if (err.code === 11000) {
        return next(new ConflictError("User already exists"));
      }
      return next(new ServerError("An error occurred on the server"));
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      const { password: _hashedPassword, ...userWithoutPass } = user.toObject();
      res.status(SUCCESS).send(userWithoutPass);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError({ message: err.message }));
      }
      if (err.code === "CastError") {
        return next(new ConflictError("User already exists"));
      }
      return next(new ServerError("An error occurred on the server"));
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Please insert email and password"));
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        return next(new UnauthorizedError("Incorrect email or password"));
      }
      return next(new ServerError("An error occurred on the server"));
    });
};

const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => {
      const { password: _hashedPassword, ...userWithoutPassword } =
        user.toObject();
      res.status(200).send(userWithoutPassword);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data format"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
      }
      return next(new ServerError("An error occurred on the server"));
    });
};

module.exports = { createUser, getCurrentUser, login, updateUser };
