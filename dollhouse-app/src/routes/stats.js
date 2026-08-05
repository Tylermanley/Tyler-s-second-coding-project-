const express = require('express');
const { PRODUCTS, DESIGNERS } = require('../data');
const { state } = require('../store');

const router = express.Router();

// Investor-dashboard-style stats. Mixes a few real live numbers (from demo state)
// with the illustrative market figures quoted in the pitch deck.
router.get('/', (req, res) => {
  res.json({
    live: {
      totalProducts: PRODUCTS.length,
      independentDesigners: DESIGNERS.filter((d) => d.independent).length,
      totalDesigners: DESIGNERS.length,
      boardsCreated: state.boards.length,
      totalLikes: state.boards.reduce((s, b) => s + b.likes.length, 0),
      totalComments: state.boards.reduce((s, b) => s + b.comments.length, 0),
      ordersPlaced: state.orders.length,
      activeSubscriptions: state.subscriptions.filter((s) => s.active).length,
    },
    market: {
      aiFashionMarket2027B: 4.4,
      homeDecorMarket2030B: 939,
      womenPurchaseShare: 0.85,
    },
    businessModel: [
      { stream: 'AI Subscription', description: 'Premium styling recommendations for paying users.' },
      { stream: 'Marketplace Commission', description: 'A percentage of each independent-designer sale.' },
      { stream: 'Sponsored Placements', description: 'Brands pay for premium placement in AI recommendations.' },
      { stream: 'VIP Boxes', description: 'Personalized fashion & decor subscription boxes, delivered monthly.' },
    ],
  });
});

module.exports = router;
