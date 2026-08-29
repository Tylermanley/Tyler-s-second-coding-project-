// A lightweight, explainable stand-in for the "AI" styling engine described in the pitch.
// Real system would swap this scoring function for a trained recommender / embedding search,
// but the API contract (quiz answers in -> ranked, explained picks out) stays the same.

const { PRODUCTS } = require('./data');

function scoreProduct(product, answers) {
  const { vibe, palette, focus, budget } = answers;
  let score = 0;
  const reasons = [];

  if (vibe && product.vibes.includes(vibe)) {
    score += 3;
    reasons.push(`matches your ${vibe} vibe`);
  }
  if (palette && product.palette === palette) {
    score += 2;
    reasons.push(`fits your ${palette} palette`);
  }
  if (focus && focus !== 'both') {
    if (product.category === focus) {
      score += 3;
    } else {
      score -= 5; // strongly deprioritize the category the user didn't ask for
    }
  }
  if (budget) {
    const tiers = ['budget', 'mid', 'luxury'];
    const dist = Math.abs(tiers.indexOf(budget) - tiers.indexOf(product.budgetTier));
    if (dist === 0) {
      score += 1.5;
      reasons.push(`within your ${budget} budget`);
    } else if (dist === 1) {
      score += 0.5;
    }
  }
  score += (product.rating - 4) * 1.2; // small boost for well-rated items
  if (product.designer.independent) {
    score += 0.5;
    reasons.push(`supports independent designer ${product.designer.name}`);
  }
  if (product.sponsored) {
    score += 0.5; // disclosed sponsored placement boost
  }

  return { score, reasons };
}

function recommend(answers, { limit = 8 } = {}) {
  const scored = PRODUCTS.map((product) => {
    const { score, reasons } = scoreProduct(product, answers);
    return { product, score, reasons };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(({ product, score, reasons }) => ({
    ...product,
    matchScore: Math.round(Math.max(0, Math.min(100, 50 + score * 8))),
    reasons: reasons.length ? reasons : ['a well-rounded pick based on your quiz'],
    sponsoredPlacement: product.sponsored,
  }));
}

module.exports = { recommend };
