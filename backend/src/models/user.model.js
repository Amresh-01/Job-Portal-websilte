import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true, // trailing spaces ko delete kar deta hai ex- "    Amresh   " -->   "Amresh"
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["recruiter", "applicant"],
      required: true,
    },
  },
  { timestamps: true }
);









const User = mongoose.model("User", userSchema);
export default User;
