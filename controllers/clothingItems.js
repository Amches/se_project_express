const ClothingItem = require("../models/clothingItem");
const { responseHandler, SUCCESS } = require("../utils/errors");

const BadRequestError = require("../errors/bad-request-error");
const ForbiddenError = require("../errors/forbidden-error");
const NotFoundError = require("../errors/not-found-error");
const ServerError = require("../errors/server-error");

const createItem = (req, res, next) => {
  console.log(req.user._id);
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(SUCCESS).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data format"));
      }
      return next(new ServerError("An error occurred on the server"));
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(SUCCESS).send(items))
    .catch((err) => {
      console.error(err);
      return next(new ServerError("An error occurred on the server"));
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item) {
        return responseHandler(res, item);
      }
      if (item.owner.toString() !== req.user._id) {
        return next(
          new ForbiddenError("You do not have permission to delete this item.")
        );
      }
      return item.deleteOne().then(() => responseHandler(res, item));
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid ID format"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item Id not Found"));
      }
      return next(new ServerError("An error occurred on the server"));
    });
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      responseHandler(res, item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid ID format"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item Id not Found"));
      }
      return next(new ServerError("An error occurred on the server"));
    });
};

const dislikeItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => responseHandler(res, item))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid ID format"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item Id not Found"));
      }
      return next(new ServerError("An error occurred on the server"));
    });
};

module.exports = { createItem, getItems, likeItem, deleteItem, dislikeItem };
