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

app.post("/send", async function (req, res) {
  const { subject, message, emails } = req.body

  if (!emails || emails.length === 0) {
    return res.send("error")
  }

  try {
    
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: emails,          
      subject: subject,
      text: message,
    })

    res.send("Success")
  } catch (err) {
    console.log(err)
    res.send("error")
  }
})
   

app.listen(5001, function () {
  console.log("server started successfully");
});