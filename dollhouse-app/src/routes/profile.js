const express = require('express');
const { state } = require('../store');

const router = express.Router();

// Demo-only "social connection" — there's no real OAuth backing this (that needs
// live API credentials per platform). Connecting just records a handle so the rest
// of the app (share buttons, cross-post messaging) has something to point at.
const PLATFORMS = ['instagram', 'tiktok', 'pinterest', 'facebook'];

function defaultProfile(userId, displayName) {
  return {
    userId,
    displayName: displayName || 'Guest',
    social: PLATFORMS.reduce((acc, platform) => {
      acc[platform] = { connected: false, handle: '' };
      return acc;
    }, {}),
  };
}

function getOrCreate(userId, displayName) {
  if (!state.profiles[userId]) {
    state.profiles[userId] = defaultProfile(userId, displayName);
  }
  return state.profiles[userId];
}

router.get('/:userId', (req, res) => {
  const profile = getOrCreate(req.params.userId);
  res.json({ profile });
});

// PUT /api/profile/:userId  { displayName }
router.put('/:userId', (req, res) => {
  const profile = getOrCreate(req.params.userId);
  const { displayName } = req.body || {};
  if (displayName && displayName.trim()) profile.displayName = displayName.trim();
  res.json({ profile });
});

// POST /api/profile/:userId/social/:platform  { handle }
router.post('/:userId/social/:platform', (req, res) => {
  const { platform, userId } = req.params;
  if (!PLATFORMS.includes(platform)) return res.status(400).json({ error: `Unknown platform "${platform}".` });
  const { handle } = req.body || {};
  if (!handle || !handle.trim()) return res.status(400).json({ error: 'A handle/username is required to connect.' });
  const profile = getOrCreate(userId);
  profile.social[platform] = { connected: true, handle: handle.trim().replace(/^@/, '') };
  res.json({ profile });
});

// DELETE /api/profile/:userId/social/:platform
router.delete('/:userId/social/:platform', (req, res) => {
  const { platform, userId } = req.params;
  if (!PLATFORMS.includes(platform)) return res.status(400).json({ error: `Unknown platform "${platform}".` });
  const profile = getOrCreate(userId);
  profile.social[platform] = { connected: false, handle: '' };
  res.json({ profile });
});

module.exports = router;
module.exports.PLATFORMS = PLATFORMS;
