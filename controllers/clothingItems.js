const ClothingItem = require("../models/clothingItem");
const {
  internalErrorHandler,
  responseHandler,
  castErrorHandler,
  BAD_REQUEST,
  SUCCESS,
} = require("../utils/errors");

const createItem = (req, res) => {
  console.log(req.user._id);
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(SUCCESS).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return internalErrorHandler(err, res);
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(SUCCESS).send(items))
    .catch((err) => {
      internalErrorHandler(err, res);
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => responseHandler(res, item))
    .catch((err) => {
      castErrorHandler(err, res);
    });
};

const likeItem = (req, res) => {
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
      castErrorHandler(err, res);
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => responseHandler(res, item))
    .catch((err) => {
      castErrorHandler(err, res);
    });
};

module.exports = { createItem, getItems, likeItem, deleteItem, dislikeItem };
