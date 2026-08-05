const path = require('path');
const express = require('express');
const cors = require('cors');

const productsRouter = require('./src/routes/products');
const recommendationsRouter = require('./src/routes/recommendations');
const boardsRouter = require('./src/routes/boards');
const designersRouter = require('./src/routes/designers');
const cartRouter = require('./src/routes/cart');
const vipRouter = require('./src/routes/vip');
const statsRouter = require('./src/routes/stats');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/recommendations', recommendationsRouter);
app.use('/api/boards', boardsRouter);
app.use('/api/designers', designersRouter);
app.use('/api', cartRouter); // exposes /api/checkout and /api/checkout/orders
app.use('/api/vip', vipRouter);
app.use('/api/stats', statsRouter);

app.use(express.static(path.join(__dirname, 'public')));

// SPA fallback: any non-API route serves the app shell.
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🏠 Dollhouse is running at http://localhost:${PORT}`);
});
