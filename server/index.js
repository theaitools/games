require("dotenv").config();
const cors = require("cors");
const express = require("express");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
const gameManager = require("./gameManager");

const app = express();
app.use(cors());
// Health check API route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
    timestamp: new Date(),
  });
});

// Serve static files from the React app
const buildPath = path.join(__dirname, "../client/build");
app.use(express.static(buildPath));

// Handle all unmatched routes by serving the React app's index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Handle socket connection
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Pass the socket to the socket handler to manage events
  require("./socketHandler")(io, socket, gameManager);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});
// Set the port for the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`💬 Game server running on port ${PORT}`);
});
