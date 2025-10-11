import React, { createContext, useState, useEffect } from "react";
import { loginUser, registerUser, logoutUser } from "../api/auth.js"; // include .js if using Vite

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || null
  );

  // Register
  const register = async (formData) => {
    try {
      const res = await registerUser(formData);
      alert(res.data.message); // backend returns { message: "User registered successfully" }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  // Login
  const login = async (formData) => {
    try {
      const res = await loginUser(formData);
      const data = res.data;
      setUser(data.user);
      setAccessToken(data.accessToken);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  // Logout
  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error(err);
    }
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  };

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (token && savedUser) {
      setUser(savedUser);
      setAccessToken(token);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, accessToken, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
