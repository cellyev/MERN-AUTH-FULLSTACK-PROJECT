const jwt = require("jsonwebtoken");

exports.generateTokenAndSetCookie = (
  res,
  userId,
  email,
  firstName,
  lastName,
  phoneNumber
) => {
  const token = jwt.sign(
    {
      userId,
      email,
      firstName,
      lastName,
      phoneNumber,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );

  res.cookie("Authorization", "Bearer " + token, {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: process.env.NODE_ENV === "production",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
};
