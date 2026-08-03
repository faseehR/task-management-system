const express = require('express');
const protect = require('../middleware/auth');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getDashboardStats,
} = require('../controllers/taskController');

const router = express.Router();

router.use(protect);

// NOTE: /stats must be declared before /:id or "stats" would be parsed as an id
router.get('/stats', getDashboardStats);

router.route('/').post(createTask).get(getTasks);

router.route('/:id').get(getTaskById).put(updateTask).delete(deleteTask);

module.exports = router;
