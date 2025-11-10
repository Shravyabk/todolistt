const Task = require('../models/task.model');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
    const { title, description, dueDate, category } = req.body;

    if (!title || !category) {
        return res.status(400).json({ message: 'Title and category are required' });
    }

    const task = new Task({
        title,
        description,
        dueDate,
        category,
        userId: req.user._id, // From 'protect' middleware
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
};

// @desc    Get all tasks for a user (with filtering)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
    const { status, category, dueDate } = req.query;

    let query = { userId: req.user._id };

    if (status) {
        query.status = status; // e.g., 'pending' or 'completed'
    }
    if (category) {
        query.category = category; // e.g., 'Work'
    }
    if (dueDate) {
        // Assumes dueDate is a string like 'YYYY-MM-DD'
        // This will find tasks on that specific day
        const start = new Date(dueDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(dueDate);
        end.setHours(23, 59, 59, 999);
        query.dueDate = { $gte: start, $lte: end };
    }

    try {
        const tasks = await Task.find(query).sort({ dueDate: 1 }); // Sort by due date
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:taskId
// @access  Private
const getTaskById = async (req, res) => {
    const task = await Task.findById(req.params.taskId);

    if (task && task.userId.equals(req.user._id)) {
        res.json(task);
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
};

// @desc    Update a task
// @route   PUT /api/tasks/:taskId
// @access  Private
const updateTask = async (req, res) => {
    const { title, description, dueDate, status, category } = req.body;

    const task = await Task.findById(req.params.taskId);

    if (task && task.userId.equals(req.user._id)) {
        task.title = title || task.title;
        task.description = description || task.description;
        task.dueDate = dueDate || task.dueDate;
        task.status = status || task.status;
        task.category = category || task.category;

        const updatedTask = await task.save();
        res.json(updatedTask);
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:taskId
// @access  Private
const deleteTask = async (req, res) => {
    const task = await Task.findById(req.params.taskId);

    if (task && task.userId.equals(req.user._id)) {
        await task.remove();
        res.json({ message: 'Task removed' });
    } else {
        res.status(4404).json({ message: 'Task not found' });
    }
};

// @desc    Mark task as completed
// @route   POST /api/tasks/:taskId/markCompleted
// @access  Private
const markTaskCompleted = async (req, res) => {
    try {
        // Atomic update that also verifies user ownership
        const task = await Task.findOneAndUpdate(
            { _id: req.params.taskId, userId: req.user._id },
            { status: 'completed' },
            { new: true } // Return the updated document
        );

        if (!task) {
            return res.status(404).json({ message: 'Task not found or user not authorized' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Mark task as pending
// @route   POST /api/tasks/:taskId/markPending
// @access  Private
const markTaskPending = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.taskId, userId: req.user._id },
            { status: 'pending' },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ message: 'Task not found or user not authorized' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get tasks by category
// @route   GET /api/tasks/category/:category
// @access  Private
const getTasksByCategory = async (req, res) => {
    try {
        const tasks = await Task.find({
            userId: req.user._id,
            category: req.params.category
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Search tasks by title or description
// @route   GET /api/tasks/search
// @access  Private
const searchTasks = async (req, res) => {
    const { q } = req.query; // Search query, e.g., /api/tasks/search?q=buy

    if (!q) {
        return res.status(400).json({ message: 'Search query "q" is required' });
    }

    try {
        const tasks = await Task.find({
            userId: req.user._id,
            $or: [
                { title: { $regex: q, $options: 'i' } }, // Case-insensitive search
                { description: { $regex: q, $options: 'i' } }
            ]
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    markTaskCompleted,
    markTaskPending,
    getTasksByCategory,
    searchTasks
};