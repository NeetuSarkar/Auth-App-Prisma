import express from "express";
import { body, validationResult } from "express-validator";
import {
  register,
  login,
  getMe,
  forgotPassword,
  verifyOtp,
  changePassword,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Email and password validators
const emailValidator = body("email")
  .isEmail()
  .withMessage("Invalid email format")
  .custom((value) => {
    if (!value.endsWith("@gmail.com")) {
      throw new Error("Only Gmail addresses are allowed");
    }
    return true;
  });

const passwordValidator = body("password")
  .isLength({ min: 6 })
  .withMessage("Password must be at least 6 characters long")
  .matches(/[A-Z]/)
  .withMessage("Password must contain an uppercase letter")
  .matches(/[0-9]/)
  .withMessage("Password must contain a number")
  .matches(/[!@#$%^&*(),.?":{}|<>]/)
  .withMessage("Password must contain a special character");

// Register route
router.post(
  "/register",
  body("name").notEmpty().withMessage("Name is required"), // name validator
  emailValidator, // Email validator
  passwordValidator, // Password validator
  (req, res, next) => {
    const errors = validationResult(req); // Get validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // Return validation errors
    }
    next(); // If no errors, move to the next middleware/controller
  },
  register
);

// Login route
router.post("/login", login);

// Forgot password route
router.post("/forgot-password", forgotPassword);

// Verify OTP route (after the user enters OTP)
router.post("/verify-otp", verifyOtp); // New route to verify OTP

// Reset password route (after OTP is verified)
router.post("/change-password", changePassword); // New route for resetting password

// Get user info (protected route)
router.get("/me", authMiddleware, getMe);

export default router;
