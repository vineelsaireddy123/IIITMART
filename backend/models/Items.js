const mongoose = require("mongoose");
// const bcrypt = require('bcrypt');
// const { v4: uuidv4 } = require('uuid');
const Schema = mongoose.Schema;

const ItemsSchema = new mongoose.Schema(
  {
    ItemName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    Description: {
      type: String,
      required: true,
    },
    Category: {
      type: String,
      required: true,
    },
    SellerName: {
      type: String,
      required: true,
    },
    SellerID: {
      type: Schema.Types.ObjectId,
      ref: "users", // The collection name you want to reference
      required: true,
    },
    ImageURL: {
      type: String,
      required: false, // set to true if image is mandatory
    },
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", ItemsSchema);

module.exports = Item;
