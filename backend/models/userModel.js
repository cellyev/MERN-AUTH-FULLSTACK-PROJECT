const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: "Invalid email address!",
      },
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      validate: {
        validator: validator.isStrongPassword,
        message:
          "Password should be strong! Include at least 1 uppercase, 1 lowercase, 1 number, and 1 symbol.",
      },
      trim: true,
      select: false,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: 2,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: 2,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      minlength: 10,
      maxlength: 15,
      validate: {
        validator: function (value) {
          return /^\+?\d{10,15}$/.test(value);
        },
        message:
          "Invalid phone number! It must be 10-15 digits and can start with a '+'",
      },
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
      select: true,
    },
    resetPasswordExpiredAt: {
      type: Date,
      select: true,
    },
    verificationToken: {
      type: String,
      select: true,
    },
    verificationTokenExpiredAt: {
      type: Date,
      select: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
