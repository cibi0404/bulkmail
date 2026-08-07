const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

app.post("/send", function (req, res) {
  const { subject, message, emails } = req.body;

  transporter.sendMail(
    {
      from: process.env.GMAIL_USER,
      bcc: emails,
      subject: subject,
      text: message,
    },
    function (err, info) {
      if (err) {
        console.log(err);
        res.send("error");
      } else {
        console.log(info);
        res.send("Success");
      }
    }
  );
});

// For local testing only
if (process.env.NODE_ENV !== "production") {
  app.listen(5001, function () {
    console.log("server started successfully");
  });
}

module.exports = app;