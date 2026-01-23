import { io } from "socket.io-client";

const SOCKET_URL =
  process.env.REACT_APP_SOCKET_URL;

console.log("🔌 SOCKET_URL =", SOCKET_URL);

export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: true,        
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
});

socket.on("connect", () => {
  console.log("✅ Socket connecté :", socket.id, "->", SOCKET_URL);
});

socket.on("connect_error", (err) => {
  console.log("❌ Socket error :", err.message);
});

socket.onAny((event, ...args) => {
  console.log("📩 [socket] event reçu :", event, args);
});
