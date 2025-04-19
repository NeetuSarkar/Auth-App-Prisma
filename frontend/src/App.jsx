import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Hero from "./pages/Hero";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgetPassword from "./pages/ForgetPassword";
import VerifyOtp from "./pages/VerifyOtp";
import Test from "./pages/Test";
import ChangePassword from "./pages/ChangePassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RedirectToProperPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/hero" element={<Hero />} />
        <Route path="/forget-password" element={<ForgetPassword />}></Route>
        <Route path="/verify-otp" element={<VerifyOtp />}></Route>
        <Route
          path="/change-password"
          element={<ChangePassword />}
        ></Route>{" "}
        {/* Added reset password route */}
        <Route path="/test" element={<Test />}></Route>
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

function RedirectToProperPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    } else {
      navigate("/hero");
    }
  }, [navigate]);

  return null;
}

export default App;
