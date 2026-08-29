const express = require('express');
const { state, id } = require('../store');
const { PRODUCTS } = require('../data');

const router = express.Router();

function hydrate(board) {
  return {
    ...board,
    products: board.productIds.map((pid) => PRODUCTS.find((p) => p.id === pid)).filter(Boolean),
    likeCount: board.likes.length,
  };
}

// GET /api/boards?ownerId=&public=true
router.get('/', (req, res) => {
  const { ownerId, public: onlyPublic } = req.query;
  let boards = state.boards;
  if (ownerId) boards = boards.filter((b) => b.ownerId === ownerId);
  if (onlyPublic === 'true') boards = boards.filter((b) => b.isPublic);
  boards = [...boards].sort((a, b) => b.createdAt - a.createdAt);
  res.json({ boards: boards.map(hydrate) });
});

router.get('/:id', (req, res) => {
  const board = state.boards.find((b) => b.id === req.params.id);
  if (!board) return res.status(404).json({ error: 'Board not found' });
  res.json({ board: hydrate(board) });
});

// POST /api/boards  { title, ownerId, ownerName, isPublic }
router.post('/', (req, res) => {
  const { title, ownerId, ownerName, isPublic } = req.body || {};
  if (!title || !ownerId) return res.status(400).json({ error: 'title and ownerId are required.' });
  const board = {
    id: id('b'),
    title,
    ownerId,
    ownerName: ownerName || 'Guest',
    isPublic: isPublic !== false,
    productIds: [],
    likes: [],
    comments: [],
    createdAt: Date.now(),
  };
  state.boards.push(board);
  res.status(201).json({ board: hydrate(board) });
});

// POST /api/boards/:id/items  { productId }
router.post('/:id/items', (req, res) => {
  const board = state.boards.find((b) => b.id === req.params.id);
  if (!board) return res.status(404).json({ error: 'Board not found' });
  const { productId } = req.body || {};
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  if (!board.productIds.includes(productId)) board.productIds.push(productId);
  res.json({ board: hydrate(board) });
});

router.delete('/:id/items/:productId', (req, res) => {
  const board = state.boards.find((b) => b.id === req.params.id);
  if (!board) return res.status(404).json({ error: 'Board not found' });
  board.productIds = board.productIds.filter((pid) => pid !== req.params.productId);
  res.json({ board: hydrate(board) });
});

// POST /api/boards/:id/like  { userId }
router.post('/:id/like', (req, res) => {
  const board = state.boards.find((b) => b.id === req.params.id);
  if (!board) return res.status(404).json({ error: 'Board not found' });
  const { userId } = req.body || {};
  if (!userId) return res.status(400).json({ error: 'userId is required.' });
  const idx = board.likes.indexOf(userId);
  if (idx === -1) board.likes.push(userId);
  else board.likes.splice(idx, 1);
  res.json({ board: hydrate(board) });
});

// POST /api/boards/:id/comments  { authorName, text }
router.post('/:id/comments', (req, res) => {
  const board = state.boards.find((b) => b.id === req.params.id);
  if (!board) return res.status(404).json({ error: 'Board not found' });
  const { authorName, text } = req.body || {};
  if (!text || !text.trim()) return res.status(400).json({ error: 'text is required.' });
  const comment = { id: id('c'), authorName: authorName || 'Guest', text: text.trim(), createdAt: Date.now() };
  board.comments.push(comment);
  res.status(201).json({ board: hydrate(board) });
});

module.exports = router;
