require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { createUser, login } = require("./controllers/users");
const auth = require("./middlewares/auth");
const { NOT_FOUND } = require("./utils/errors");

const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const itemsRouter = require("./routes/clothingItems");
const usersRouter = require("./routes/users");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.post("/signin", login);
app.post("/signup", createUser);

app.use("/users", usersRouter);
app.use(
  "/items",
  (req, res, next) => {
    if (req.method === "GET") {
      return next();
    }
    return auth(req, res, next);
  },
  itemsRouter
);

app.use(errorLogger);

app.use((req, res) =>
  res.status(NOT_FOUND).send({ message: "Item Id not Found " })
);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});
