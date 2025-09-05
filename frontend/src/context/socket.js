import { io } from "socket.io-client";

// Prevent socket from connecting immediately
const socket = io("https://mywhatsapp-ymha.onrender.com", {
  autoConnect: false,
});

export default socket;