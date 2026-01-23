import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3001" || process.env.REACT_APP_SOCKET_URL;

console.log("🔌 SOCKET_URL =", SOCKET_URL);

export const socket = io(SOCKET_URL, {
  autoConnect: false,      
  withCredentials: true,   
  reconnection: true,
  reconnectionAttempts: 5,
});

socket.on("connect", () => {
  console.log("✅ Socket connecté::", socket.id, "->", SOCKET_URL);
});

socket.on("connect_error", (err) => {
  console.log("❌ Socket error :", err.message);
});

socket.onAny((event, ...args) => {
  console.log("📩 [socket] event reçu :", event, args);
});
