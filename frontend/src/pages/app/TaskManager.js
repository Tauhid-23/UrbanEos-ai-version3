import React, { useState } from 'react';
import { Plus, CheckSquare, Droplets, Trash2, Calendar } from 'lucide-react';
import { mockTasks, mockPlants } from '../../data/mock';

const TaskManager = () => {
  const [tasks, setTasks] = useState(mockTasks);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    task: '',
    plant: '',
    time: 'Morning',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0]
  });

  const handleTaskComplete = (taskId) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
          : task
      )
    );
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    }
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    const task = {
      id: Date.now(),
      ...newTask,
      status: 'pending'
    };
    setTasks(prevTasks => [...prevTasks, task]);
    setNewTask({
      task: '',
      plant: '',
      time: 'Morning',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0]
    });
    setShowModal(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaskIcon = (task) => {
    if (task.toLowerCase().includes('water')) return <Droplets className="h-5 w-5 text-blue-500" />;
    if (task.toLowerCase().includes('prune')) return <span className="text-lg">✂️</span>;
    if (task.toLowerCase().includes('fertilize')) return <span className="text-lg">🌾</span>;
    return <CheckSquare className="h-5 w-5 text-gray-500" />;
  };

  const completedTasks = tasks.filter(task => task.status === 'completed');
  const pendingTasks = tasks.filter(task => task.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
          <p className="text-gray-600 mt-1">
            {pendingTasks.length} pending • {completedTasks.length} completed
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-xl shadow-lg">
        {tasks.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`
                  p-6 flex items-center space-x-4 transition-all hover:bg-gray-50
                  ${task.status === 'completed' ? 'bg-green-50 opacity-75' : ''}
                `}
              >
                {/* Checkbox */}
                <button
                  onClick={() => handleTaskComplete(task.id)}
                  className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0
                    ${task.status === 'completed'
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 hover:border-green-500'
                    }
                  `}
                >
                  {task.status === 'completed' && <CheckSquare className="h-3 w-3" />}
                </button>

                {/* Task Icon */}
                <div className="flex-shrink-0">
                  {getTaskIcon(task.task)}
                </div>

                {/* Task Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className={`
                      ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}
                    `}>
                      <p className="font-semibold text-lg">{task.task}</p>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <span>🌿</span>
                          <span>{task.plant}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span>⏰</span>
                          <span>{task.time}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{task.dueDate}</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 mt-2 sm:mt-0">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <CheckSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks yet</h3>
            <p className="text-gray-600 mb-6">Create your first task to keep track of your garden care</p>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary"
            >
              Add Your First Task
            </button>
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add New Task</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Task Name</label>
                <input
                  type="text"
                  value={newTask.task}
                  onChange={(e) => setNewTask(prev => ({ ...prev, task: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Water Basil"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Plant</label>
                <select
                  value={newTask.plant}
                  onChange={(e) => setNewTask(prev => ({ ...prev, plant: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a plant</option>
                  {mockPlants.map(plant => (
                    <option key={plant.id} value={plant.name}>{plant.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <select
                  value={newTask.time}
                  onChange={(e) => setNewTask(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 py-2"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;