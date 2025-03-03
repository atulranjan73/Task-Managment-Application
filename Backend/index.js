const express = require('express');
const connectDB = require('./Models/db');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');

// Import Routes
const AuthRouter = require('./Routes/AuthRouter');
const TaskRouter = require('./Routes/TaskRoute');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Use Routes
app.use('/auth', AuthRouter);
app.use('/tasks', TaskRouter);

// Connect to MongoDB and Start Server
connectDB().then(() => {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
