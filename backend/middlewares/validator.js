const Joi = require("joi");

exports.signUpSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: ["com", "net", "org", "id"] } })
    .required()
    .messages({
      "any.required": "Email is required!",
      "string.empty": "Email is required!",
      "string.email": "Invalid email address!",
    }),
  password: Joi.string()
    .min(8)
    .required()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#])[A-Za-z\d@$!%*?&^#]{8,}$/
    )
    .messages({
      "any.required": "Password is required!",
      "string.empty": "Password is required!",
      "string.min": "Password should be at least 8 characters long",
      "string.pattern.base":
        "Password should include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
    }),
  confirmPassword: Joi.string().required().valid(Joi.ref("password")).messages({
    "any.required": "Confirm password is required!",
    "any.only": "Confirm password does not match the password",
  }),
  firstName: Joi.string()
    .regex(/^[a-zA-Z]+$/)
    .required()
    .messages({
      "any.required": "First name is required!",
      "string.empty": "First name is required!",
      "string.pattern.base":
        "First name should only contain alphabetic characters (A-Z, a-z)",
    }),
  lastName: Joi.string()
    .regex(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      "any.required": "Last name is required!",
      "string.empty": "Last name is required!",
      "string.pattern.base":
        "Last name should only contain alphabetic characters and spaces",
    }),
  phoneNumber: Joi.string()
    .regex(/^\+[1-9]\d{1,14}$/)
    .required()
    .messages({
      "any.required": "Phone number is required!",
      "string.empty": "Phone number is required!",
      "string.pattern.base": "Invalid phone number format",
    }),
});

exports.signInSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: ["com", "net", "org", "id"] } })
    .required()
    .messages({
      "any.required": "Email is required!",
      "string.empty": "Email is required!",
      "string.email": "Invalid email address!",
    }),
  password: Joi.string()
    .min(8)
    .required()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#])[A-Za-z\d@$!%*?&^#]{8,}$/
    )
    .messages({
      "any.required": "Password is required!",
      "string.empty": "Password is required!",
      "string.min": "Password should be at least 8 characters long",
      "string.pattern.base":
        "Password should include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
    }),
});

exports.resetPasswordSchema = Joi.object({
  newPassword: Joi.string()
    .min(8)
    .required()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .messages({
      "any.required": "Password is required!",
      "string.empty": "Password is required!",
      "string.min": "Password should be at least 8 characters long",
      "string.pattern.base":
        "Password should include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
    }),
  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref("newPassword"))
    .messages({
      "any.required": "Confirm password is required!",
      "any.only": "Confirm password does not match the password",
    }),
});
