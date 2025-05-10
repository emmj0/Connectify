const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./Routes/authRoutes');
const userRoutes = require('./Routes/UserRoutes');

const path = require('path');

const app = express();
// server.js or index.js in backend
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:5173', // Replace with frontend origin
    credentials: true
  }));

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});