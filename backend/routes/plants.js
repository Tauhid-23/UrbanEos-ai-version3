import express from 'express';
const router = express.Router();

// TODO: Implement in Phase 3
router.get('/', (req, res) => {
  res.status(501).json({ message: 'Plants endpoint - Coming in Phase 3' });
});

export default router;