// socket.js
// Modular Socket.IO client logic for ShoppingKaro frontend
// Handles connecting to backend and real-time events for products, chat, and room management

import { io } from 'socket.io-client';

// Set your backend URL (adjust if needed)
const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

// Create a single socket instance (singleton)
const socket = io(SOCKET_URL, {
  autoConnect: false, // Connect manually for auth, etc.
});

// Connect the socket (call this after user login, etc.)
export function connectSocket(userId) {
  if (!socket.connected) {
    // Pass userId as auth for personal room
    socket.auth = { userId };
    socket.connect();
  }
}

// Disconnect the socket (call on logout, etc.)
export function disconnectSocket() {
  if (socket.connected) socket.disconnect();
}

// Join a wishlist room for real-time updates
export function joinWishlistRoom(wishlistId) {
  socket.emit('joinWishlist', wishlistId);
}

// Leave a wishlist room
export function leaveWishlistRoom(wishlistId) {
  socket.emit('leaveWishlist', wishlistId);
}

// Send a product update (add/edit/delete)
export function sendProductUpdate({ wishlistId, product, action }) {
  socket.emit('productUpdate', { wishlistId, product, action });
}

// Listen for product updates
export function onProductUpdated(callback) {
  socket.on('productUpdated', callback);
}

// Send a chat message
export function sendChatMessage({ wishlistId, message, user }) {
  socket.emit('chatMessage', { wishlistId, message, user });
}

// Listen for chat messages
export function onChatMessage(callback) {
  socket.on('chatMessage', callback);
}

// Listen for user join/leave events (optional for presence)
export function onUserJoined(callback) {
  socket.on('userJoined', callback);
}
export function onUserLeft(callback) {
  socket.on('userLeft', callback);
}

// Listen for disconnect (optional)
export function onSocketDisconnect(callback) {
  socket.on('disconnect', callback);
}

// Export the socket instance for advanced use
export default socket; 