import express from "express";
import {
  registerUser,
  loginUser,
  googleLogin,
  forgotPassword,
} from "../controllers/authcontroller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/googlelogin", googleLogin);
router.post("/forgot-password", forgotPassword);

export default router;
