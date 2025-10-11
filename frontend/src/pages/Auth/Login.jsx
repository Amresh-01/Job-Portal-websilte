import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { AuthContext } from "../../context/AuthContext";
import { googleLoginUser } from "../../api/auth.js";
import { FaEnvelope, FaLock } from "react-icons/fa";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Normal login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form);
      if (res.user.role === "recruiter") navigate("/recruiter/dashboard");
      else navigate("/applicant/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Google login success
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await googleLoginUser(credentialResponse.credential);
      const data = res.data;
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.user.role === "recruiter") navigate("/recruiter/dashboard");
      else navigate("/applicant/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Google login failed");
    }
  };

  const handleGoogleFailure = () => {
    alert("Google login failed");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-blue-100 via-white to-emerald-100 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-400 opacity-20 blur-3xl rounded-full top-[-10%] left-[-10%]" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md flex flex-col gap-4 z-10"
      >
        <h2 className="text-2xl font-extrabold text-center text-blue-800 mb-2 tracking-wide">
          Jobify Login
        </h2>

        <div className="flex items-center border rounded-lg p-2 bg-white/50 shadow-inner focus-within:ring-2 focus-within:ring-blue-400">
          <FaEnvelope className="text-gray-400 mr-2" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="bg-transparent w-full outline-none"
          />
        </div>
        <div className="flex items-center border rounded-lg p-2 bg-white/50 shadow-inner focus-within:ring-2 focus-within:ring-blue-400">
          <FaLock className="text-gray-400 mr-2" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="bg-transparent w-full outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-700 hover:bg-blue-800 transition text-white py-2 rounded-lg font-semibold text-lg shadow-md disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="flex items-center gap-3 my-2">
          <hr className="flex-1 border-gray-300" />
          <span className="text-gray-400">or</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
          />
        </div>

        <p
          className="text-sm text-blue-700 text-center cursor-pointer underline underline-offset-2 hover:text-blue-900 transition"
          onClick={() => navigate("/register")}
        >
          Don't have an account? Register
        </p>
      </form>
    </div>
  );
};

export default Login;
