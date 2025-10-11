import Task from '../models/Task.js';
import Plant from '../models/Plant.js';

// @desc    Get all tasks for logged-in user
// @route   GET /api/tasks?status=pending&priority=high&date=2024-01-15
// @access  Private
export const getAllTasks = async (req, res) => {
  try {
    const { status, priority, date } = req.query;
    
    // Build query
    const query = { user: req.user._id };
    
    if (status) {
      query.status = status;
    }
    
    if (priority) {
      query.priority = priority;
    }
    
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.dueDate = { $gte: startDate, $lte: endDate };
    }

    const tasks = await Task.find(query)
      .populate('plant', 'name type image')
      .sort({ dueDate: 1, priority: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks',
      error: error.message
    });
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('plant', 'name type image');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      task
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task',
      error: error.message
    });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      user: req.user._id
    };

    // If plant ID is provided, verify it exists and belongs to user
    if (taskData.plant) {
      const plant = await Plant.findOne({
        _id: taskData.plant,
        user: req.user._id,
        isActive: true
      });

      if (!plant) {
        return res.status(404).json({
          success: false,
          message: 'Plant not found'
        });
      }

      // Set plantName from the plant
      if (!taskData.plantName) {
        taskData.plantName = plant.name;
      }
    }

    const task = await Task.create(taskData);

    // Populate plant details before sending response
    await task.populate('plant', 'name type image');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create task',
      error: error.message
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // If status is being changed to completed, set completedAt
    if (req.body.status === 'completed' && task.status !== 'completed') {
      req.body.completedAt = new Date();
    }

    // If status is being changed from completed, clear completedAt
    if (req.body.status && req.body.status !== 'completed' && task.status === 'completed') {
      req.body.completedAt = null;
    }

    // Update task fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'user' && key !== '_id') {
        task[key] = req.body[key];
      }
    });

    await task.save();
    await task.populate('plant', 'name type image');

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to update task',
      error: error.message
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete task',
      error: error.message
    });
  }
};

// @desc    Get tasks by date range
// @route   GET /api/tasks/range
// @access  Private
export const getTasksByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const tasks = await Task.find({
      user: req.user._id,
      dueDate: { $gte: start, $lte: end }
    })
      .populate('plant', 'name type image')
      .sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    console.error('Get tasks by date range error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks',
      error: error.message
    });
  }
};
