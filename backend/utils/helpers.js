// Format error messages
export const formatErrorMessage = (error) => {
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return errors.join(', ');
  }
  
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    return `${field} already exists`;
  }
  
  return error.message || 'Server error';
};

// Pagination helper
export const paginate = (query, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return query.skip(skip).limit(limit);
};

// Calculate days until date
export const daysUntil = (date) => {
  const now = new Date();
  const target = new Date(date);
  const diffTime = target - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Generate random ID
export const generateId = (prefix = '') => {
  return prefix + Date.now().toString() + Math.random().toString(36).substring(2, 9);
};

// Validate Bangladesh phone number
export const isValidBangladeshPhone = (phone) => {
  const phoneRegex = /^(\+880|880|0)?1[3-9]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Format Bangladesh phone number
export const formatBangladeshPhone = (phone) => {
  const cleaned = phone.replace(/\s/g, '');
  if (cleaned.startsWith('+880')) return cleaned;
  if (cleaned.startsWith('880')) return '+' + cleaned;
  if (cleaned.startsWith('0')) return '+880' + cleaned.substring(1);
  return '+880' + cleaned;
};

// Calculate plant health score based on various factors
export const calculatePlantHealth = (plant) => {
  let health = 100;
  
  // Reduce health if overdue for watering
  if (plant.careSchedule?.watering?.nextWatering) {
    const daysOverdue = daysUntil(plant.careSchedule.watering.nextWatering);
    if (daysOverdue < 0) {
      health -= Math.abs(daysOverdue) * 5;
    }
  }
  
  // Factor in plant status
  if (plant.status === 'attention') health -= 10;
  if (plant.status === 'sick') health -= 30;
  
  return Math.max(0, Math.min(100, health));
};

// Success response helper
export const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

// Error response helper
export const errorResponse = (res, message = 'Error occurred', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  return res.status(statusCode).json(response);
};
