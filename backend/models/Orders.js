const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
   
    BuyerID: {
      type: String,
      required: true,
    },
    ItemID: {
      type: String,
      required: true,
    },
    ItemName: { 
      type: String,
      required: true,
    },
    SellerID: {
      type: String,
      required: true,
    },
    Amount: {
      type: String,
      required: true,
    },
    OTP: {
      type:String,
      required: true,
    
    },
    Status: {
      type: String,
      required: true,
      default: "Pending",
    },
    SellerName: {
      type: String,
      required: true,
    },
    BuyerName :{
        type: String,
        required: true,
    }
  },
  { timestamps: true }
);

const Orders = mongoose.model("Orders", userSchema);

module.exports = Orders;
