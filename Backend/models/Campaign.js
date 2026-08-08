const mongoose = require("mongoose");

const recipientSchema = new mongoose.Schema({
  email: { type: String, required: true },
  status: { type: String, enum: ["success", "failed"], required: true },
});

const campaignSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  message: { type: String, required: true },
  recipients: [recipientSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Campaign", campaignSchema);
