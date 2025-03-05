// Models/NotificationModel.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  type: { type: String, enum: ["taskAssignment"], required: true },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "declined"], // Matches backend expectation
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

module.exports = mongoose.model("Notification", notificationSchema);