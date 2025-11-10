const express = require('express');
const router = express.Router();
const {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    markTaskCompleted,
    markTaskPending,
    getTasksByCategory,
    searchTasks
} = require('../controllers/task.controller');
const { protect } = require('../middleware/auth.middleware');

// All routes here are protected
router.use(protect);

// /api/tasks
router.route('/')
    .post(createTask)
    .get(getTasks);

// /api/tasks/search
router.get('/search', searchTasks);

// /api/tasks/category/:category
router.get('/category/:category', getTasksByCategory);

// /api/tasks/:taskId
router.route('/:taskId')
    .get(getTaskById)
    .put(updateTask)
    .delete(deleteTask);

// /api/tasks/:taskId/mark...
router.post('/:taskId/markCompleted', markTaskCompleted);
router.post('/:taskId/markPending', markTaskPending);

module.exports = router;