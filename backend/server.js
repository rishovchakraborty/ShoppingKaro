const app = require('./app');
const mongoose = require('mongoose');
// Import the modular socket logic
const { initSocket } = require('./socket');
const http = require('http'); // Node's HTTP module

const PORT = process.env.PORT ;
const MONGO_URI = process.env.MONGO_URI ;

// Create an HTTP server from the Express app
const server = http.createServer(app);

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected');
    // Initialize Socket.IO with the HTTP server
    initSocket(server);
    // Start the server (now supports both HTTP and WebSocket)
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  }); 