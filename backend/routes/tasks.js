import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTasksByDateRange
} from '../controllers/taskController.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Task CRUD routes
router.route('/')
  .get(getAllTasks)
  .post(createTask);

router.get('/range', getTasksByDateRange);

router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

export default router;