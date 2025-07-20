// socket.js
// Modular Socket.IO logic for ShoppingKaro backend
// Handles real-time events for products, chat, and room management

let ioInstance = null;

// This function initializes Socket.IO and sets up event handlers
function initSocket(server) {
  const { Server } = require('socket.io');
  const io = new Server(server, {
    cors: {
      origin: '*', // Adjust as needed for production
      methods: ['GET', 'POST']
    }
  });
  ioInstance = io;

  // Listen for client connections
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join a room for this user's userId (for direct notifications)
    const userId = socket.handshake.auth?.userId;
    if (userId) {
      socket.join(userId.toString());
      console.log(`Socket ${socket.id} joined personal room: ${userId}`);
    }

    // Join a wishlist room
    socket.on('joinWishlist', (wishlistId) => {
      socket.join(wishlistId);
      console.log(`User ${socket.id} joined wishlist room: ${wishlistId}`);
      // Optionally notify others in the room
      socket.to(wishlistId).emit('userJoined', socket.id);
    });

    // Leave a wishlist room
    socket.on('leaveWishlist', (wishlistId) => {
      socket.leave(wishlistId);
      console.log(`User ${socket.id} left wishlist room: ${wishlistId}`);
      socket.to(wishlistId).emit('userLeft', socket.id);
    });

    // Handle real-time product updates (add/edit/delete)
    socket.on('productUpdate', ({ wishlistId, product, action }) => {
      // Broadcast the update to all users in the wishlist room except sender
      socket.to(wishlistId).emit('productUpdated', { product, action });
    });

    // Handle real-time chat messages
    socket.on('chatMessage', async ({ wishlistId, message, user }) => {
      try {
        // Save the message to the wishlist's messages array
        const Wishlist = require('./models/Wishlist');
        // user can be a string (username) or an object; for now, store as username
        await Wishlist.findByIdAndUpdate(wishlistId, {
          $push: {
            messages: {
              user: user._id || null, // if available
              username: typeof user === 'string' ? user : user.username || user.email || 'Unknown',
              text: message,
              timestamp: new Date()
            }
          }
        });
      } catch (err) {
        console.error('Failed to save chat message:', err);
      }
      // Broadcast the chat message to all users in the wishlist room
      io.to(wishlistId).emit('chatMessage', { message, user, timestamp: Date.now() });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      // Optionally handle user leaving all rooms
    });
  });
}

// Export the init function and a getter for the io instance
module.exports = {
  initSocket,
  getIO: () => ioInstance,
}; 