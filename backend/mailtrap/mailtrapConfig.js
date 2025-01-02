const { MailtrapClient } = require("mailtrap");
require("dotenv").config();

exports.mailtrapClient = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN,
});

exports.sender = {
  email: "hello@demomailtrap.com",
  name: "Valtechno",
};
