const express = require('express');
const router = express.Router();
const Auth = require('../auth/authenticateUser');
const Todo = require('../Models/todo');

// Create a new todo
router.post('/create', Auth, async (req, res) => {
    try {
        const { title, description } = req.body;
        const userId = req.user._id;

        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const newTodo = new Todo({
            title,
            description,
            user: userId,
        });
        await newTodo.save();

        res.status(201).json({ message: 'Created Successfully', todo: newTodo });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a specific todo by ID
router.get('/:id', Auth, async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo || todo.user.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: 'Todo not found or unauthorized' });
        }
        res.status(200).json(todo);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all todos for the authenticated user
router.get('/', Auth, async (req, res) => {
    try {
        const userId = req.user._id;
        const todos = await Todo.find({ user: userId });
        res.status(200).json(todos);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a todo
router.post('/update/:id', Auth, async (req, res) => {
    try {
        const { title, description } = req.body;
        const todo = await Todo.findById(req.params.id);

        if (!todo || todo.user.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: 'Todo not found or unauthorized' });
        }

        if (title) {
            todo.title = title;
        }
        if (description) {
            todo.description = description;
        }

        await todo.save();
        res.status(200).json({ message: 'Todo updated successfully', todo });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a todo
router.delete('/:id', Auth, async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found or unauthorized' });
        }
        await todo.deleteOne();
        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
        console.log(err);
    }
});

module.exports = router;
