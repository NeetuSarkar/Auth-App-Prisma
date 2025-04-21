import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email || "";
  const [formData, setFormData] = useState({ email: emailFromState, otp: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(true);
  const [timer, setTimer] = useState(60);
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const maskEmail = (email) => {
    const [name, domain] = email.split("@");
    if (name.length <= 2) {
      return name[0] + "*".repeat(name.length - 1) + "@" + domain;
    }
    return (
      name[0] +
      "*".repeat(name.length - 2) +
      name[name.length - 1] +
      "@" +
      domain
    );
  };

  useEffect(() => {
    if (!emailFromState) {
      navigate("/forget-password");
    } else {
      setSuccessMessage(`OTP sent to ${maskEmail(emailFromState)}`);
    }

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setOtpCooldown(false);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [emailFromState, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/auth/verify-otp`,
        formData
      );
      setSuccessMessage(data.message);
      navigate("/change-password", {
        replace: true,
        state: { email: formData.email },
      });
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    }
    setSending(false);
  };

  const handleResendOtp = async () => {
    setOtpCooldown(true);
    setTimer(60);
    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email: formData.email,
      });
      setSuccessMessage(`OTP resent to ${maskEmail(formData.email)}`);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>

        {successMessage && (
          <p className="text-green-600 mb-4">{successMessage}</p>
        )}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-gray-700">OTP</label>
          <input
            type="text"
            name="otp"
            value={formData.otp}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            placeholder="Enter OTP"
            required
          />
        </div>

        <button
          type="submit"
          className={`w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200 ${
            sending && "opacity-50 cursor-not-allowed"
          }`}
          disabled={sending}
        >
          {sending ? "Verifying..." : "Verify OTP"}
        </button>

        <button
          type="button"
          className={`w-full mt-2 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition duration-200 ${
            otpCooldown && "opacity-50 cursor-not-allowed"
          }`}
          onClick={handleResendOtp}
          disabled={otpCooldown}
        >
          {otpCooldown ? `Resend OTP in ${timer}s` : "Resend OTP"}
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;
