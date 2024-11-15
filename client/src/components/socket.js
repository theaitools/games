// client/src/socket.js
import { io } from "socket.io-client";

// Initialize the connection with the server
const socket = io("http://localhost:5000"); // Adjust the URL and port as needed
console.log("skkkr", socket);

export default socket;
