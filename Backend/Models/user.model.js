const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique : true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }], // Added tasks array to store assigned tasks
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
