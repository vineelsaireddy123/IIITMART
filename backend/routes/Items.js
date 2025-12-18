const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const router = express.Router();
const { verifyToken } = require("../util/auth");
// const { createSecretToken } = require("../util/token");
const jwt = require("jsonwebtoken");
const User = require("../models/Users.js");
const Item = require("../models/Items.js");

router.post("/additems", verifyToken, async (req, res) => {
  const { ItemName, Price, Description, Category,ImageUrl } = req.body;
  const id = await User.findOne({ _id: req.userId });
 
  if (!id) {
    return res.status(400).json({ message: "Seller not found." });
  }
  const item = new Item({
    ItemName,
    price: Price,
    Description,
    Category,
    SellerName: id.firstName + id.lastName,
    SellerID: req.userId,
    ImageURL:ImageUrl
  });
  await item.save();
  res.status(200).json({ message: "Item added successfully." });
});

router.get("/getitembyid", verifyToken, async (req, res) => {
  const { id } = req.query;
 
  const itemdetails = await Item.findOne({ _id: id });
  if (!itemdetails) {
    return res.status(400).json({ message: "Item not found." });
  }
  const user = await User.findOne({ _id: itemdetails.SellerID });

  res.status(200).json({
    items: {
      id: itemdetails._id,
      ItemName: itemdetails.ItemName,
      price: itemdetails.price,
      Description: itemdetails.Description,
      Category: itemdetails.Category,
      Sellername: user.firstName + user.lastName,
      SellerID: itemdetails.SellerID,
      ImageURL: itemdetails.ImageURL,
    },
    message: "Item details fetched successfully.",
  });
});

router.get("/allitems", async (req, res) => {
  const items = await Item.find();
  res.status(200).json({ items });
});

module.exports = router;
