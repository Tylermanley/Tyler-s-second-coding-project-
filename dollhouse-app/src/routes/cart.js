const express = require('express');
const { state, id } = require('../store');
const { PRODUCTS } = require('../data');

const router = express.Router();

// POST /api/checkout  { userId, userName, items: [{ productId, qty }], address }
router.post('/checkout', (req, res) => {
  const { userId, userName, items, address } = req.body || {};
  if (!userId || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'userId and a non-empty items array are required.' });
  }

  const lineItems = [];
  let subtotal = 0;
  for (const { productId, qty } of items) {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) continue;
    const quantity = Math.max(1, Number(qty) || 1);
    subtotal += product.price * quantity;
    lineItems.push({ product, quantity, lineTotal: Number((product.price * quantity).toFixed(2)) });
  }
  if (lineItems.length === 0) return res.status(400).json({ error: 'No valid products in cart.' });

  const shipping = subtotal >= 75 ? 0 : 6.99;
  const tax = Number((subtotal * 0.0825).toFixed(2));
  const total = Number((subtotal + shipping + tax).toFixed(2));

  const deliveryDays = 3 + Math.floor(Math.random() * 5); // 3-7 days, "delivered straight to your door"
  const deliveryDate = new Date(Date.now() + deliveryDays * 24 * 60 * 60 * 1000);

  const order = {
    id: id('order'),
    userId,
    userName: userName || 'Guest',
    lineItems,
    subtotal: Number(subtotal.toFixed(2)),
    shipping,
    tax,
    total,
    address: address || null,
    estimatedDelivery: deliveryDate.toISOString(),
    createdAt: Date.now(),
    status: 'confirmed',
  };
  state.orders.push(order);
  res.status(201).json({ order });
});

// GET /api/checkout/orders?userId=
router.get('/orders', (req, res) => {
  const { userId } = req.query;
  let orders = state.orders;
  if (userId) orders = orders.filter((o) => o.userId === userId);
  res.json({ orders: [...orders].sort((a, b) => b.createdAt - a.createdAt) });
});

module.exports = router;
