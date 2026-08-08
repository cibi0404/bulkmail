const express = require("express");
const cors = require("cors");

require("dotenv").config();
const mongoose = require("mongoose");
const Campaign = require("./models/Campaign");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));
  
const app = express();
app.use(express.json());
app.use(cors());

const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);


app.post("/send", async function (req, res) {
  const { subject, message, emails } = req.body;

  const recipients = [];

  for (let i = 0; i < emails.length; i++) {
    try {
      await resend.emails.send({
        from: "BulkMail <onboarding@resend.dev>",
        to: emails[i],
        subject: subject,
        text: message,
      });
      recipients.push({ email: emails[i], status: "success" });
    } catch (err) {
      console.log(`Failed to send to ${emails[i]}:`, err.message);
      recipients.push({ email: emails[i], status: "failed" });
    }
  }

  try {
    const campaign = new Campaign({ subject, message, recipients });
    await campaign.save();
  } catch (err) {
    console.log("Error saving campaign:", err);
  }

  res.send("Success");
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