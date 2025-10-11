import express from 'express';
const router = express.Router();

// TODO: Implement in Phase 5
router.post('/', (req, res) => {
  res.status(501).json({ message: 'Quote endpoint - Coming in Phase 5' });
});

export default router;