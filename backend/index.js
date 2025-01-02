const express = require("express");
const connectDB = require("./db/connectDB.js");
const dotenv = require("dotenv");
const authRouter = require("./routes/authRouter.js");
const cookieParser = require("cookie-parser");
const CORS = require("cors");
const path = require("path");

dotenv.config();

const app = express();

app.use(CORS({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  return res.json({
    message: "Hello, World!",
  });
});

app.use("/api/auth", authRouter);

if (process.env.NODE_ENV !== "production") {
  app.use(express.static(path.join(__dirname, "frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(process.env.PORT, () => {
  connectDB();
  console.log(`Server is running on port ${process.env.PORT}`);
});
