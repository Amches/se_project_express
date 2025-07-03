const errorHandler = (err, req, res, next) => {
  console.error(err);
  console.log("Error occurred on:", req.method, req.url);
  console.log("Request body:", req.body);
  console.log("Query parameters:", req.query);

  const statusCode = err.statusCode || 500;

  if (res.headersSent) {
    return next(err);
  }

  const message =
    statusCode === 500 ? "An error has occurred on the server." : err.message;

  return res.status(statusCode).send({ message });
};

module.exports = errorHandler;
