import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const ChangePassword = () => {
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const emailFromState = location.state?.email || "";
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setSuccessMessage("");
      return;
    }

    setSending(true);
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/auth/change-password`,
        {
          email: emailFromState,
          password: formData.password,
        }
      );
      setSuccessMessage(data.message || "Password changed successfully");
      setError("");
      setSending(false);
      navigate("/login", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Try again."
      );
      setSuccessMessage("");
      setSending(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Change Password</h2>

        {error && <div className="mb-4 text-red-500">{error}</div>}
        {successMessage && (
          <div className="mb-4 text-green-500">{successMessage}</div>
        )}

        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="password">
            New Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium" htmlFor="confirmPassword">
            Re-enter Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          {sending ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
