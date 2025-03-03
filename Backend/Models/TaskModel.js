const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true, 
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    priority: {
      type: String,
      required: [true, "Priority is required"],
      enum: {
        values: ["Low", "Medium", "High"],
        message: "Priority must be Low, Medium, or High",
      },
      default: "Medium",
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
      validate: {
        validator: function (value) {
          return value >= new Date().setHours(0, 0, 0, 0);
        },
        message: "Due date cannot be in the past",
      },
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Assigned user is required"],
    },
    status: {
      type: String,
      enum: {
        values: ["Pending", "In Progress", "Completed", "Blocked"],
        message: "Status must be Pending, In Progress, Completed, or Blocked",
      },
      default: "Pending",
    },
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

taskSchema.index({ title: 1, assignedTo: 1 }, { unique: true });

taskSchema.virtual("assignedUser", {
  ref: "User",
  localField: "assignedTo",
  foreignField: "_id",
  justOne: true,
});

taskSchema.virtual("collaboratorUsers", {
  ref: "User",
  localField: "collaborators",
  foreignField: "_id",
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;