import api from "./axiosConfig.js";

// Named exports
export const loginUser = (data) => api.post("/auth/login", data);
export const registerUser = (data) => api.post("/auth/register", data);
export const logoutUser = () => api.post("/auth/logout");

// Google login
export const googleLoginUser = (idToken) =>
  api.post("/auth/google-login", { idToken });
