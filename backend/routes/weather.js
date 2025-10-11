import express from 'express';
const router = express.Router();

// TODO: Implement in Phase 4
router.get('/', (req, res) => {
  res.status(501).json({ message: 'Weather endpoint - Coming in Phase 4' });
});

export default router;