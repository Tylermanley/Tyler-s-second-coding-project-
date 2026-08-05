const express = require('express');
const { recommend } = require('../recommend');

const router = express.Router();

// POST /api/recommendations  { vibe, palette, focus, budget }
router.post('/', (req, res) => {
  const { vibe, palette, focus, budget } = req.body || {};
  if (!vibe && !palette && !focus && !budget) {
    return res.status(400).json({ error: 'Provide at least one quiz answer (vibe, palette, focus, budget).' });
  }
  const picks = recommend({ vibe, palette, focus, budget });
  res.json({ picks, basedOn: { vibe, palette, focus, budget } });
});

module.exports = router;
