const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid'); 

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    default: () => uuidv4() 
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true, 
  },
  contactNumber: {
    type: String,
    required: true,
    match: /^\d{10}$/, 
  },
  password: {
    type: String,
    required: true,
    minlength: 8,  
  },
  cart: {
    type: [{
      itemId: { type: String, required: true },
      productName: { type: String, required: true },
      price: { type: Number, required: true, min: 0 }, 
      sellerId: { type: String, required: true } 
      
    }],
    default: [] 
  },
  sellerReviews: {
    type: [{
      sellerId: { type: String, required: true }, 
      review: { type: String, required: true },
      rating: { type: Number, required: true, min: 1, max: 10 }, 
      date: { type: Date, default: Date.now }
    }],
    default: [] 
  }
}, { timestamps: true });



const User = mongoose.model('User', userSchema);

module.exports = User;
