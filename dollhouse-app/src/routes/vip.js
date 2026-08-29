const express = require('express');
const { state, id } = require('../store');
const { VIP_TIERS } = require('../data');

const router = express.Router();

router.get('/tiers', (req, res) => {
  res.json({ tiers: VIP_TIERS });
});

// POST /api/vip/subscribe  { userId, userName, tierId }
router.post('/subscribe', (req, res) => {
  const { userId, userName, tierId } = req.body || {};
  const tier = VIP_TIERS.find((t) => t.id === tierId);
  if (!userId || !tier) return res.status(400).json({ error: 'userId and a valid tierId are required.' });

  const existing = state.subscriptions.find((s) => s.userId === userId && s.active);
  if (existing) existing.active = false;

  const subscription = {
    id: id('sub'),
    userId,
    userName: userName || 'Guest',
    tierId: tier.id,
    tierName: tier.name,
    price: tier.price,
    active: true,
    startedAt: Date.now(),
    nextBoxDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  };
  state.subscriptions.push(subscription);
  res.status(201).json({ subscription });
});

router.get('/subscription', (req, res) => {
  const { userId } = req.query;
  const subscription = state.subscriptions.find((s) => s.userId === userId && s.active) || null;
  res.json({ subscription });
});

router.post('/cancel', (req, res) => {
  const { userId } = req.body || {};
  const subscription = state.subscriptions.find((s) => s.userId === userId && s.active);
  if (subscription) subscription.active = false;
  res.json({ ok: true });
});

module.exports = router;
