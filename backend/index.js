require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/UserRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Set up MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/email_breach_ki')
.then(() => {
  console.log("Connected to MongoDB!");
})
.catch(err => console.error("MongoDB connection error:", err));

// Use Routes
app.use('/api', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
