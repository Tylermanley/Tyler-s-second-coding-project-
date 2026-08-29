const express = require('express');
const { PRODUCTS, VIBES, PALETTES } = require('../data');

const router = express.Router();

// GET /api/products?category=&vibe=&palette=&budget=&designer=&search=
router.get('/', (req, res) => {
  const { category, vibe, palette, budget, designer, search } = req.query;
  let results = PRODUCTS;

  if (category && category !== 'all') results = results.filter((p) => p.category === category);
  if (vibe) results = results.filter((p) => p.vibes.includes(vibe));
  if (palette) results = results.filter((p) => p.palette === palette);
  if (budget) results = results.filter((p) => p.budgetTier === budget);
  if (designer) results = results.filter((p) => p.designer.id === designer);
  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(
      (p) => p.name.toLowerCase().includes(q) || p.subcategory.toLowerCase().includes(q) || p.designer.name.toLowerCase().includes(q)
    );
  }

  res.json({ products: results, count: results.length, filters: { vibes: VIBES, palettes: PALETTES } });
});

router.get('/:id', (req, res) => {
  const product = PRODUCTS.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ product });
});

module.exports = router;
