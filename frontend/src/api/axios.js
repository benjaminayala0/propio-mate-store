import axios from "axios";

const rawUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
const cleanUrl = rawUrl.replace(/\/+$/, "");
const baseURL = cleanUrl.endsWith("/api") ? cleanUrl : `${cleanUrl}/api`;

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "ngrok-skip-browser-warning": "true",
    "Content-Type": "application/json"
  },
});

export default api;
