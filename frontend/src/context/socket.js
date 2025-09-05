import { io } from "socket.io-client";

// Prevent socket from connecting immediately
const socket = io("http://localhost:5000", {
  autoConnect: false,
});

export default socket;