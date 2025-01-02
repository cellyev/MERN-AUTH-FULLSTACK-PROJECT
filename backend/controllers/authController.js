const crypto = require("crypto");
const {
  sendVerificationCode,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} = require("../mailtrap/emails");
const {
  signUpSchema,
  signInSchema,
  resetPasswordSchema,
} = require("../middlewares/validator");
const User = require("../models/userModel");
const {
  generateTokenAndSetCookie,
} = require("../utils/generateTokenAndSetCookie");
const {
  generateVerificationToken,
} = require("../utils/generateVerificationCode");
const { doHash, doHashValidation } = require("../utils/hashing");
const { date } = require("joi");

exports.signUp = async (req, res) => {
  const { email, password, firstName, lastName, phoneNumber, confirmPassword } =
    req.body;

  try {
    const { error, value } = signUpSchema.validate({
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      phoneNumber,
    });
    if (error) {
      const errorMessage = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: errorMessage,
        data: {},
      });
    }

    const userAlreadyExist = await User.findOne({ email });
    if (userAlreadyExist) {
      return res.status(400).json({
        success: false,
        message: "User already exists!",
        data: {},
      });
    }

    const hashedPassword = await doHash(password, 12);

    const verificationToken = generateVerificationToken();
    const verificationTokenExpiredAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    const newUser = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phoneNumber,
      verificationToken,
      verificationTokenExpiredAt,
    });

    const result = await newUser.save();
    newUser.password = undefined;

    generateTokenAndSetCookie(
      res,
      newUser._id,
      newUser.email,
      newUser.firstName,
      newUser.lastName,
      newUser.phoneNumber
    );

    await sendVerificationCode(email, verificationToken);

    return res.status(201).json({
      success: true,
      message: "User created successfully!",
      data: result,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
      data: {},
    });
  }
};

exports.verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    const existingUser = await User.findOne({
      verificationToken: code,
      verificationTokenExpiredAt: { $gt: Date.now() },
    });

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code or expired code.",
        data: {},
      });
    }

    existingUser.isVerified = true;
    existingUser.verificationToken = undefined;
    existingUser.verificationTokenExpiredAt = undefined;
    await existingUser.save();

    await sendWelcomeEmail(existingUser.email, existingUser.firstName);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully!",
      data: existingUser,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
      data: {},
    });
  }
};

exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { error, value } = signInSchema.validate({ email, password });
    if (error) {
      const errorMessage = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: errorMessage,
        data: {},
      });
    }

    const existingUser = await User.findOne({ email: value.email }).select(
      "+password"
    );
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials!",
        data: {},
      });
    }

    if (!existingUser.password) {
      return res.status(400).json({
        success: false,
        message: "User's password is missing!",
        data: {},
      });
    }

    const isPasswordValid = await doHashValidation(
      value.password,
      existingUser.password
    );

    if (!isPasswordValid) {
      console.log("password validation");
      return res.status(400).json({
        success: false,
        message: "Invalid credentials!",
        data: {},
      });
    }

    generateTokenAndSetCookie(
      res,
      existingUser._id,
      existingUser.email,
      existingUser.firstName,
      existingUser.lastName,
      existingUser.phoneNumber
    );

    existingUser.lastLogin = new Date();
    await existingUser.save();

    return res.status(200).json({
      success: true,
      message: "User logged in successfully!",
      data: existingUser,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
      data: {},
    });
  }
};

exports.signOut = async (req, res) => {
  res.clearCookie("Authorization").status(200).json({
    success: true,
    message: "User logged out successfully!",
    data: {},
  });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User not found!",
        data: {},
      });
    }

    // Generate reset token
    const resetPasswordToken = crypto.randomBytes(20).toString("hex");
    const resetPasswordExpiredAt = Date.now() + 1 * 60 * 60 * 1000;

    existingUser.resetPasswordToken = resetPasswordToken;
    existingUser.resetPasswordExpiredAt = resetPasswordExpiredAt;
    await existingUser.save();

    await sendPasswordResetEmail(
      existingUser.email,
      `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`
    );

    return res.status(200).json({
      success: true,
      message: "Password reset email sent successfully!",
      data: {},
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
      data: {},
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    const { error, value } = resetPasswordSchema.validate({
      newPassword,
      confirmPassword,
    });
    if (error) {
      const errorMessage = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: errorMessage,
        data: {},
      });
    }

    const existingUser = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiredAt: { $gt: Date.now() },
    }).select("+password");

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset password token!",
        data: {},
      });
    }

    const hashedPassword = await doHash(newPassword, 12);
    existingUser.password = hashedPassword;
    existingUser.resetPasswordToken = undefined;
    existingUser.resetPasswordExpiredAt = undefined;
    await existingUser.save();

    await sendResetSuccessEmail(existingUser.email);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully!",
      data: {},
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
      data: {},
    });
  }
};

exports.checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found!",
        data: {},
      });
    }

    return res.status(200).json({
      success: true,
      message: "User authenticated successfully!",
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
      data: {},
    });
  }
};
