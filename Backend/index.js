require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const mongoose = require("mongoose");
const Campaign = require("./models/Campaign");
const { Resend } = require("resend");
const jwt = require("jsonwebtoken")

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));
const app = express();
app.use(express.json());
app.use(cors());

const resend = new Resend(process.env.RESEND_API_KEY);

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}
function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access only" });
  }
  next();
}

app.post("/send", verifyToken,async function (req, res) {
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
app.post("/login", async function (req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Login failed" });
  }
});

app.post("/signup", async function (req, res) {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    email: email,
    password: hashedPassword,
    role: "user",
  });
  await user.save();

  res.json({ message: "Signup successful" });
});

app.get("/campaigns", verifyToken, requireAdmin, async function (req, res) {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    console.log("Error fetching campaigns:", err);
    res.status(500).json({ error: "Failed to fetch campaigns" });
  }
});
if (process.env.NODE_ENV !== "production") {
  app.listen(5001, function () {
    console.log("server started successfully");
  });
}

module.exports = app;