const express = require('express');
const connectDB = require('./DB/db');
const dotenv = require('dotenv');
const cors = require('cors');
const todoRoutes = require('./routes/todoRoutes');
const userRoutes = require('./routes/UserRoutes'); 

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // Ensure that JSON body parsing is enabled before the routes

// Routes
app.use('/api/todos', todoRoutes);
app.use('/api/users', userRoutes);

// Test Route
app.get('/', (req, res) => {
    res.send('Todo App Backend is Running!');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
