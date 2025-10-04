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
    googleId: {
      type: String,
    },
    role: {
      type: String,
      enum: ["recruiter", "applicant"],
      required: true,
    },
    refreshToken: {
      type: String,
    }, // store latest refresh token
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
userSchema.methods.comparePassword = async function (enteredPassword) {
  const hash = String(this.password);
  const plain = String(enteredPassword);
  return await bcrypt.compare(plain, hash);
};

const User = mongoose.model("User", userSchema);
export default User;
