import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

const {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRES,
  REFRESH_TOKEN_EXPIRES,
  GOOGLE_CLIENT_ID,
  PASSWORD_RESET_TOKEN_EXP,
} = process.env;

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

function signAccessToken(user) {
  return jwt.sign({ sub: user._id, role: user.role }, JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES || "15m",
  });
}
function signRefreshToken(user) {
  return jwt.sign({ sub: user._id }, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES || "7d",
  });
}

// register
export const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Missing fields",
    });
  }

  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists)
    return res.status(401).json({
      message: "User is already exists.",
    });

  const user = new User({ username, email, password, role });
  await user.save();
  res.status(201).json({ message: "User created" });
};

// login
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({
      message: "Missing fields",
    });

  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({
      message: "No user is Present with this email",
    });

  const ok = await user.comparePassword(password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });
};

// logout
export const logout = async (req, res) => {};
