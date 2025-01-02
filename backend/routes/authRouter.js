const express = require("express");
const {
  signUp,
  signIn,
  signOut,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
} = require("../controllers/authController");
const { verifyToken } = require("../middlewares/verifyToken");

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
