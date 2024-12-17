import { io } from "socket.io-client";


const socket = io(import.meta.env.VITE_SERVER_URL, {
  transports: ["websocket"],
  withCredentials: true,
  query: {
    userId: JSON.parse(localStorage.getItem("userInfo"))?.data._id
  },
});

export { socket };
