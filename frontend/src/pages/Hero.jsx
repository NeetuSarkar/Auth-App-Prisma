import React from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
        🚀 Welcome to Prisma Auth App!
      </h1>
      <p className="text-lg md:text-xl mb-8 text-center max-w-xl">
        Your gateway to secure authentication. Simple, fast, and reliable.
      </p>
      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={() => navigate("/register")}
          className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-100 transition duration-300"
        >
          Get Started
        </button>
        <button
          onClick={() => navigate("/login")}
          className="bg-transparent border-2 border-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-indigo-600 transition duration-300"
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
};

export default Hero;
