const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/Users.js");
const Item = require("../models/Items.js");
const Order = require("../models/Orders.js");
const { verifyToken } = require("../util/auth");
// const { createSecretToken } = require("../util/token");
const jwt = require("jsonwebtoken");

router.post("/closeorder", verifyToken, async (req, res) => {
  const OrderId = req.body.id;
 
  const OTP = req.body.OTP;
  
  const order = await Order.findOne({ _id: OrderId });

  const isOTPValid = await bcrypt.compare(OTP.toString(), order.OTP);
  if (!isOTPValid) {
    return res.status(400).json({ message: "Incorrect OTP." });
  } else {
    const result = await Order.updateOne(
      { _id: OrderId }, // Filter to find the user by ID
      { $set: { Status: "Delivered" } } // Update data
    );
    return res.status(200).json({ message: "Order Delivered successfully." });
  }
});
router.post("/regenarteotp", verifyToken, async (req, res) => {
  const OrderId = req.body.id;

  const order = await Order.findOne({ _id: OrderId });

  const randomSixDigit = getRandomSixDigit();

  const OTP = await bcrypt.hash(randomSixDigit.toString(), 10);
  try {
    if (order) {
      const result = await Order.updateOne(
        { _id: OrderId }, // Filter to find the user by ID
        { $set: { OTP: OTP } } // Update data
      );
      res.status(200).json({
        message: "OTP regenerated successfully.",
        OTP: randomSixDigit,
      });
    } else {
      res.status(400).json({ message: "Order not found." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

router.get("/getorders", verifyToken, async (req, res) => {
  const id = req.userId;

  const ordersBoughtPending = await Order.find({
    BuyerID: id,
    Status: "Pending",
  });
  const ordersBoughtDelivered = await Order.find({
    BuyerID: id,
    Status: "Delivered",
  });
 
  const ordersSold = await Order.find({
    SellerID: id,
    Status: "Delivered",
  });
  res.status(200).json({
    message: "Orders fetched successfully.",
    pending: ordersBoughtPending,
    Delevired: ordersBoughtDelivered,
    Sold: ordersSold,
  });
});
function getRandomSixDigit() {
  return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
}
router.post("/placeorder", verifyToken, async (req, res) => {
  const { items } = req.body;
  
  const BuyerID = req.userId;
  const Buyer = await User.findOne({ _id: BuyerID });
  const BuyerName = Buyer.firstName + Buyer.lastName;

  let randomSixDigit = getRandomSixDigit();
  
  const OTP = await bcrypt.hash(randomSixDigit.toString(), 10);

  try {
    for (let i = 0; i < items.length; i++) {
      const Items = await Item.findOne({ _id: items[i].itemId });
      const ItemName = Items.ItemName;
      const SellerID = Items.SellerID;
      const Amount = Items.price;
      const SellerName = Items.SellerName;


      const order = new Order({
        BuyerID,
        ItemID: items[i].itemId,
        ItemName,
        SellerID,
        Amount,
        OTP,
        SellerName,
        BuyerName,
      });
      await order.save();
    }
    const buyer = await User.findOne({ _id: BuyerID });
    buyer.cart = [];
    await buyer.save();
    res
      .status(200)
      .json({ message: "Order placed successfully.", OTP: randomSixDigit });
  } catch (error) {
    console.log(error);
  }
});

module.exports=router;