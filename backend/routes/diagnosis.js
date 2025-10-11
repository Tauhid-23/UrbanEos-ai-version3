import express from 'express';
const router = express.Router();

// TODO: Implement in Phase 4
router.post('/identify', (req, res) => {
  res.status(501).json({ message: 'Diagnosis endpoint - Coming in Phase 4' });
});

export default router;