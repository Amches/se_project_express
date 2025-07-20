const router = require("express").Router();
const { validateItem, validateItemId } = require("../middlewares/validation");
const auth = require("../middlewares/auth");
const {
  createItem,
  getItems,
  likeItem,
  deleteItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);
router.post("/", auth, validateItem, createItem);
router.put("/:itemId/likes", auth, validateItemId, likeItem);
router.delete("/:itemId", auth, validateItemId, deleteItem);
router.delete("/:itemId/likes", auth, validateItemId, dislikeItem);

module.exports = router;
