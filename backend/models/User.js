const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Notifications for various events (including invites)
  notifications: [
    {
      type: { type: String },
      wishlistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Wishlist' },
      wishlistName: String,
      invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      read: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  // Pending invites for wishlists (for real-time join requests)
  pendingInvites: [
    {
      wishlistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Wishlist' },
      wishlistName: String,
      invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      invitedByName: String,
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); 