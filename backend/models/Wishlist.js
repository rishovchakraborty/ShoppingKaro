const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  // Chat messages for this wishlist
  messages: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      username: String, // for quick display
      text: String,
      timestamp: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Wishlist', wishlistSchema); 