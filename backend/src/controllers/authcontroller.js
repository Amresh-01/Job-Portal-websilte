import jwt from "jsonwebtoken";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import User from "../models/user.model.js";
import { sendResetEmail } from "../utils/sendmail.js";

const {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRES,
  REFRESH_TOKEN_EXPIRES,
  GOOGLE_CLIENT_ID,
  PASSWORD_RESET_TOKEN_EXP,
} = process.env;

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// Helper Functions
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

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

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
export const googleLogin = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) return res.status(400).json({ message: "ID token required" });

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (!user) {
      // If not, create a new user
      user = new User({
        username: name,
        email,
        password: crypto.randomBytes(32).toString("hex"), // random password
        role: "user",
      });
      await user.save();
    }

    // Generate JWT tokens
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    res.json({
      message: "Google login successful",
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
    res
      .status(500)
      .json({ message: "Google login failed", error: err.message });
  }
};
