import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
import User from "../models/user.model.js";
import { sendResetEmail } from "../utils/sendmail.js";
import passport from "../config/passport.js";

dotenv.config();

const {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRES,
  REFRESH_TOKEN_EXPIRES,
  GOOGLE_CLIENT_ID,
  PASSWORD_RESET_TOKEN_EXP,
  GOOGLE_CLIENT_SECRET,
} = process.env;

// Helper Functions
function signAccessToken(user) {
  return jwt.sign({ sub: user._id, role: user.role }, JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES || "1h",
  });
}

function signRefreshToken(user) {
  return jwt.sign({ sub: user._id }, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES || "7d",
  });
}

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = new User({ username, email, password, role });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Missing required fields" });

    if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
      throw new Error("JWT secrets are not defined in environment variables!");
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    console.log("Access Token:", accessToken);
    const decoded = jwt.decode(accessToken);
    console.log("Decoded token:", decoded);
    console.log("Current timestamp:", Math.floor(Date.now() / 1000));

    res.json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  try {
    // Optional: remove refresh token from DB / client cookie
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpires =
      Date.now() + (parseInt(PASSWORD_RESET_TOKEN_EXP) || 10 * 60 * 1000);

    await user.save();

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    await sendResetEmail(user.email, resetUrl);

    res.json({ message: "Password reset email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//  GOOGLE LOGIN

export const googleCallback = async (req, res) => {
  try {
    const user = req.user;

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.redirect(
      `http://localhost:8080/google-success?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Google login failed" });
  }
};
