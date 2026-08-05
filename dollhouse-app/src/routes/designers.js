const express = require('express');
const { DESIGNERS, PRODUCTS } = require('../data');

const router = express.Router();

router.get('/', (req, res) => {
  const designers = DESIGNERS.map((designer) => {
    const products = PRODUCTS.filter((p) => p.designer.id === designer.id);
    return {
      ...designer,
      productCount: products.length,
      avgRating: products.length ? Number((products.reduce((s, p) => s + p.rating, 0) / products.length).toFixed(1)) : null,
    };
  });
  res.json({ designers });
});

router.get('/:id/products', (req, res) => {
  const designer = DESIGNERS.find((d) => d.id === req.params.id);
  if (!designer) return res.status(404).json({ error: 'Designer not found' });
  const products = PRODUCTS.filter((p) => p.designer.id === designer.id);
  res.json({ designer, products });
});

// Mock "apply to sell on Dollhouse" intake — in production this would kick off a review workflow.
router.post('/apply', (req, res) => {
  const { brandName, contactEmail, category, story } = req.body || {};
  if (!brandName || !contactEmail) {
    return res.status(400).json({ error: 'brandName and contactEmail are required.' });
  }
  res.status(201).json({
    message: `Thanks for applying, ${brandName}! Our merchandising team will review your ${category || 'collection'} and follow up at ${contactEmail} within 5 business days.`,
    applicationId: `app-${Date.now()}`,
  });
});

module.exports = router;
