import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
const baseURL = apiUrl.endsWith("/api") ? apiUrl : `${apiUrl}/api`;

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "ngrok-skip-browser-warning": "true",
    "Content-Type": "application/json"
  },
});

export default api;
