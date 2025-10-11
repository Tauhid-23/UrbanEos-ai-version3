import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getAllPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
  addPlantNote,
  updateCareSchedule,
  addHarvestLog
} from '../controllers/plantController.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Plant CRUD routes
router.route('/')
  .get(getAllPlants)
  .post(createPlant);

router.route('/:id')
  .get(getPlantById)
  .put(updatePlant)
  .delete(deletePlant);

// Plant-specific actions
router.post('/:id/notes', addPlantNote);
router.put('/:id/care', updateCareSchedule);
router.post('/:id/harvest', addHarvestLog);

export default router;