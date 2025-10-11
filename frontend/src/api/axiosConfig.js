import axios from "axios";

// Create an axios instance
const api = axios.create({
  baseURL: "http://localhost:8080/api", // <-- your backend URL
  withCredentials: true, // required if backend uses cookies
});

// Interceptor to attach JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
