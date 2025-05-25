const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;
const CREATED = 201;
const SUCCESS = 200;
const CONFLICT = 409;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;

function internalErrorHandler(err, res) {
  console.error(err);
  return res
    .status(INTERNAL_SERVER_ERROR)
    .send({ message: "An error has ocurred on the server" });
}

function responseHandler(res, item) {
  if (!item) {
    return res.status(NOT_FOUND).send({ message: "Item Id not Found " });
  }
  return res.status(SUCCESS).send(item);
}

function castErrorHandler(err, res) {
  console.error(err);
  if (err.name === "CastError") {
    return res.status(BAD_REQUEST).send({ message: "Invalid ID format" });
  }
  if (err.name === "DocumentNotFoundError") {
    return res.status(NOT_FOUND).send({ message: err.message });
  }
  return res
    .status(INTERNAL_SERVER_ERROR)
    .send({ message: "An error has ocurred on the server" });
}

module.exports = {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  SUCCESS,
  CREATED,
  CONFLICT,
  UNAUTHORIZED,
  FORBIDDEN,
  internalErrorHandler,
  responseHandler,
  castErrorHandler,
};
