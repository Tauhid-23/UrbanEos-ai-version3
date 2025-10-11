import Plant from '../models/Plant.js';

// @desc    Get all plants for logged-in user
// @route   GET /api/plants
// @access  Private
export const getAllPlants = async (req, res) => {
  try {
    const plants = await Plant.find({ user: req.user._id, isActive: true })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: plants.length,
      plants
    });
  } catch (error) {
    console.error('Get plants error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch plants',
      error: error.message
    });
  }
};

// @desc    Get single plant by ID
// @route   GET /api/plants/:id
// @access  Private
export const getPlantById = async (req, res) => {
  try {
    const plant = await Plant.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true
    });

    if (!plant) {
      return res.status(404).json({
        success: false,
        message: 'Plant not found'
      });
    }

    res.status(200).json({
      success: true,
      plant
    });
  } catch (error) {
    console.error('Get plant error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch plant',
      error: error.message
    });
  }
};

// @desc    Create new plant
// @route   POST /api/plants
// @access  Private
export const createPlant = async (req, res) => {
  try {
    const plantData = {
      ...req.body,
      user: req.user._id
    };

    const plant = await Plant.create(plantData);

    res.status(201).json({
      success: true,
      message: 'Plant added successfully',
      plant
    });
  } catch (error) {
    console.error('Create plant error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create plant',
      error: error.message
    });
  }
};

// @desc    Update plant
// @route   PUT /api/plants/:id
// @access  Private
export const updatePlant = async (req, res) => {
  try {
    const plant = await Plant.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true
    });

    if (!plant) {
      return res.status(404).json({
        success: false,
        message: 'Plant not found'
      });
    }

    // Update plant fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'user' && key !== '_id') {
        plant[key] = req.body[key];
      }
    });

    await plant.save();

    res.status(200).json({
      success: true,
      message: 'Plant updated successfully',
      plant
    });
  } catch (error) {
    console.error('Update plant error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to update plant',
      error: error.message
    });
  }
};

// @desc    Delete plant (soft delete)
// @route   DELETE /api/plants/:id
// @access  Private
export const deletePlant = async (req, res) => {
  try {
    const plant = await Plant.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true
    });

    if (!plant) {
      return res.status(404).json({
        success: false,
        message: 'Plant not found'
      });
    }

    // Soft delete
    plant.isActive = false;
    await plant.save();

    res.status(200).json({
      success: true,
      message: 'Plant deleted successfully'
    });
  } catch (error) {
    console.error('Delete plant error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete plant',
      error: error.message
    });
  }
};

// @desc    Add note to plant
// @route   POST /api/plants/:id/notes
// @access  Private
export const addPlantNote = async (req, res) => {
  try {
    const plant = await Plant.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true
    });

    if (!plant) {
      return res.status(404).json({
        success: false,
        message: 'Plant not found'
      });
    }

    const note = {
      date: new Date(),
      content: req.body.content,
      type: req.body.type || 'observation'
    };

    plant.notes.push(note);
    await plant.save();

    res.status(200).json({
      success: true,
      message: 'Note added successfully',
      plant
    });
  } catch (error) {
    console.error('Add note error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to add note',
      error: error.message
    });
  }
};

// @desc    Update plant care schedule (watering, fertilizing)
// @route   PUT /api/plants/:id/care
// @access  Private
export const updateCareSchedule = async (req, res) => {
  try {
    const plant = await Plant.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true
    });

    if (!plant) {
      return res.status(404).json({
        success: false,
        message: 'Plant not found'
      });
    }

    // Update care schedule
    if (req.body.watering) {
      plant.careSchedule.watering = {
        ...plant.careSchedule.watering,
        ...req.body.watering
      };
    }

    if (req.body.fertilizing) {
      plant.careSchedule.fertilizing = {
        ...plant.careSchedule.fertilizing,
        ...req.body.fertilizing
      };
    }

    if (req.body.pruning) {
      plant.careSchedule.pruning = {
        ...plant.careSchedule.pruning,
        ...req.body.pruning
      };
    }

    await plant.save();

    res.status(200).json({
      success: true,
      message: 'Care schedule updated successfully',
      plant
    });
  } catch (error) {
    console.error('Update care schedule error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to update care schedule',
      error: error.message
    });
  }
};

// @desc    Add harvest log entry
// @route   POST /api/plants/:id/harvest
// @access  Private
export const addHarvestLog = async (req, res) => {
  try {
    const plant = await Plant.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true
    });

    if (!plant) {
      return res.status(404).json({
        success: false,
        message: 'Plant not found'
      });
    }

    const harvestEntry = {
      date: req.body.date || new Date(),
      quantity: req.body.quantity,
      unit: req.body.unit,
      quality: req.body.quality,
      notes: req.body.notes
    };

    plant.harvestLog.push(harvestEntry);
    await plant.save();

    res.status(200).json({
      success: true,
      message: 'Harvest log added successfully',
      plant
    });
  } catch (error) {
    console.error('Add harvest log error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to add harvest log',
      error: error.message
    });
  }
}
