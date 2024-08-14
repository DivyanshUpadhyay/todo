const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

// User registration route
router.post('/register', async (req, res) => {
    try {
        const { username, name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User Already Exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            name,
            email,
            password: hashedPassword,
        });
        await newUser.save();

        res.status(201).json({ message: 'User Created Successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// User login route
router.post('/login', async (req, res) => {
    try {
        const { identifier, password } = req.body;

        // Find user by email or username
        const query = identifier.includes('@') ? { email: identifier } : { username: identifier };
        const user = await User.findOne(query);

        if (!user) {
            return res.status(400).json({ message: 'Invalid username/email or password' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username/email or password' });
        }

        // Generate a token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// User update route
router.put('/:userId', async (req, res) => {
    try {
        const { username, name, email, password } = req.body;

        // Find user by ID
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user information
        if (username) user.username = username;
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10);

        await user.save();
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
