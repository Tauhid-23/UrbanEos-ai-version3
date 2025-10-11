import express from 'express';
const router = express.Router();

// TODO: Implement in Phase 5
router.get('/posts', (req, res) => {
  res.status(501).json({ message: 'Community endpoint - Coming in Phase 5' });
});

export default router;