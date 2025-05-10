const mongoose = require("mongoose");

const clothingItemSchema = new mongoose.Schema({});

modules.exports = mongoose.model("item", clothingItemSchema);
