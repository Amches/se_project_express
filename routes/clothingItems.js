const router = require("express").Router();
const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);
router.post("/", createItem);
router.put("/:itemId/likes", updateItem);
router.delete("/:itemId", deleteItem);
router.delete("/:itemId/likes", () => console.log("unlike item"));

module.exports = router;
