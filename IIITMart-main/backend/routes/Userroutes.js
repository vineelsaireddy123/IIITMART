const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/Users.js");
const Item = require("../models/Items.js");
const Order = require("../models/Orders.js");
const { verifyToken } = require("../util/auth");
const jwt = require("jsonwebtoken");
const valid = (email) => {
  const pattern =
    /^[a-zA-Z0-9]+\.[a-zA-Z0-9]+@(students\.iiit\.ac\.in|iiit\.ac\.in|research\.iiit\.ac\.in)$/;
  return pattern.test(email.trim());
};

function isValidContactNumber(number) {
  const regex = /^[0-9]{10}$/;
  return regex.test(number);
}
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET);
};


router.post("/addtocart", verifyToken, async (req, res) => {
  const ItemID = req.body.ItemID;
  const itemdetails = await Item.findOne({ _id: ItemID });
  const token = req.headers["authorization"]?.split(" ")[1]; 

  if (!itemdetails) {
    return res.status(400).json({ message: "Item not found." });
  }

  if (req.userId == itemdetails.SellerID) {
    return res
      .status(400)
      .json({ message: "You cannot add your own item to cart." });
  }
  const user = await User.findOne({ _id: req.userId });
  if (!user) {
    return res.status(400).json({ message: "User not found." });
  }
 
  const cart = user.cart;

  const item = {
    itemId: ItemID,
    productName: itemdetails.ItemName,
    price: itemdetails.price,
    sellerId: itemdetails.SellerID,
  };

  cart.push(item);

  const result = await User.updateOne(
    { _id: req.userId }, 
    { $set: { cart: cart } } 
  );
  if (result.modifiedCount > 0) {
    // console.log("Item added to cart successfully.");
    res.status(200).json({ message: "Item added to cart successfully." });
  } else {
    // console.log("User not found");
    res.status(404).json({ message: "User not found" });
  }
});

router.post("/removefromcart", verifyToken, async (req, res) => {
  const id = req.userId;

  const ItemID = req.body.ItemID;


  try {
    const result = await User.findOne({ _id: id });

    const r1 = await User.updateOne(
      { _id: id },
      { $pull: { cart: { _id: ItemID } } }
    );

    if (r1.modifiedCount > 0) {
      // console.log("Item removed from cart successfully.");
    
      const result1 = await User.findOne({ _id: id });
   
      res.status(200).json({
        message: "Item removed from cart successfully.",
        cart: result1.cart,
      });
    }
  } catch (error) {
    console.log(error);
  }
  // console.log();
});
router.get("/getcart", verifyToken, async (req, res) => {
  try {
    // 1) grab the user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // 2) for each cart entry, fetch its Item and pluck SellerName
    const updatedCart = await Promise.all(
      user.cart.map(async (cartEntry) => {
        const details = await Item
          .findById(cartEntry.itemId)
          .select("SellerName")
          .lean();

        // inject sellerName (or null if missing)
        return {
          ...cartEntry.toObject(),        // bring along itemId, productName, price, sellerId
          sellerName: details?.SellerName ?? null
        };
      })
    );
    console.log("Updated Cart:", updatedCart);  
    // 3) send it back
    return res
      .status(200)
      .json({
        message: "Cart fetched successfully.",
        cart: updatedCart
      });
  } catch (err) {
    console.error("Error in /getcart:", err);
    return res
      .status(500)
      .json({ message: "Internal server error." });
  }
});

router.get("/pendingorders", verifyToken, async (req, res) => {
  const id = req.userId;

  const orders = await Order.find({ SellerID: id, Status: "Pending" });

  res
    .status(200)
    .json({ message: "Orders fetched successfully.", orders: orders });
});
router.post("/login", async (req, res) => {

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }
  if (valid(email) === false) {
    return res.status(400).json({ message: "Invalid email format " });
  }

  try {
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(400).json({ message: "User not found." });
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Incorrect password." });
    }
    const token = createToken(foundUser._id);
    const id = await User.findOne({ email });
 
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res.status(200).json({
      message: "User registered successfully.",
      id: id._id,
      name: foundUser.firstName,
      token: token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

router.post("/signup", async (req, res) => {
  console.log("Signup request received");
  console.log("Request body:", req.body);
  const { firstName, lastName, email, age, contactNumber, password } = req.body;

  if (
    !firstName ||
    !lastName ||
    !age ||
    !contactNumber ||
    !email ||
    !password
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }
  if (valid(email) === false) {
    return res.status(400).json({ message: "Invalid email format." });
  }
  if (isValidContactNumber(contactNumber) === false) {
    return res.status(400).json({ message: "Invalid contact number" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      age,
      contactNumber,
      password: hashedPassword,
    });

    await user.save();
    const id = await User.findOne({ email });
    const token = createToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    
    res.status(200).json({
      message: "User registered successfully.",
      id: id._id,
      name: id.firstName,
      token: token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

router.get("/getuserdetails", verifyToken, async (req, res) => {
 
  try {
    const user = await User.findOne({ _id: req.userId });
    if (user) {
     // in the user find the no of orders where user is the seller
      const orders = await Order.find({ SellerID: user._id });
      // count the no of orders and add it to the user object
      // not in the reviews fields creatw a new field called reviews and add the no of orders
      
      res.status(200).json({
        message: "User details fetched successfully.",
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
        contactNumber: user.contactNumber,
        reviews: user.reviews,
        // cart: user.cart,
        ordersCount: orders.length, // Add the count of orders
      });
    } else {
      res.status(400).json({ message: "User not found." });
    }
  } catch (error) {
    console.error("Error during get user details:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
  // res.clearCookie("token");
});



router.post("/updateuserdetails", verifyToken, async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    age,
    contactNumber,
    password,
    newpassword,
  } = req.body;
 

  try {
    const id = await User.findOne({ email });
    if (password) {
      const isPasswordValid = await bcrypt.compare(password, id.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Incorrect password." });
      }
    }
    const updateData = {
      firstName,
      lastName,
      email,
      age,
      contactNumber,
      password: await bcrypt.hash(newpassword, 10),
    };
    // const user = await User.findOne({ _id: req.userId });
    const result = await User.updateOne(
      { _id: req.userId }, // Filter to find the user by ID
      { $set: updateData } // Update data
    );

    if (result.modifiedCount > 0) {
     
      res.status(200).json({
        message: "User updated successfully",
        firstName: firstName,
        lastName: lastName,
        email: email,
        age: age,
        contactNumber: contactNumber,
      });
    } else if (result.matchedCount > 0) {
      // console.log("No changes made; user details are already up-to-date.");
      res.status(200).json({ message: "No changes made" });
    } else {
      // console.log("User not found");
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error during get user details:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
  // res.clearCookie("token");
});

module.exports = router;
