// In-memory runtime state for the demo. Resets whenever the server restarts —
// intentional for a pitch prototype; swap for a real database before production use.

const crypto = require('crypto');

function id(prefix) {
  return `${prefix}-${crypto.randomBytes(6).toString('hex')}`;
}

const state = {
  boards: [
    {
      id: 'b-seed-1',
      title: 'Cozy Neutral Bedroom',
      ownerId: 'guest-maya',
      ownerName: 'Maya',
      isPublic: true,
      productIds: ['p17', 'p24', 'p1', 'p26'],
      likes: ['guest-jo', 'guest-priya'],
      comments: [
        { id: id('c'), authorName: 'Jo', text: 'Obsessed with this palette 😍', createdAt: Date.now() - 1000 * 60 * 60 * 5 },
      ],
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    },
    {
      id: 'b-seed-2',
      title: 'Gala Night Look',
      ownerId: 'guest-priya',
      ownerName: 'Priya',
      isPublic: true,
      productIds: ['p3', 'p12', 'p6'],
      likes: ['guest-maya'],
      comments: [],
      createdAt: Date.now() - 1000 * 60 * 60 * 24,
    },
    {
      id: 'b-seed-3',
      title: 'Coastal Living Room Refresh',
      ownerId: 'guest-jo',
      ownerName: 'Jo',
      isPublic: true,
      productIds: ['p22', 'p11', 'p19', 'p26'],
      likes: [],
      comments: [
        { id: id('c'), authorName: 'Maya', text: 'That pendant light is everything', createdAt: Date.now() - 1000 * 60 * 30 },
      ],
      createdAt: Date.now() - 1000 * 60 * 60 * 10,
    },
  ],
  orders: [],
  subscriptions: [],
};

module.exports = { state, id };
