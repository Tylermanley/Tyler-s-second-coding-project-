// Seed data for the Dollhouse demo platform.
// Everything lives in memory — this is an investor-pitch prototype, not a production store.

const DESIGNERS = [
  { id: 'd-luma', name: 'Luma & Co.', independent: true, bio: 'Small-batch knitwear studio out of Portland.', founded: 2021 },
  { id: 'd-fernweh', name: 'Fernweh Home', independent: true, bio: 'Sustainably sourced textiles & ceramics.', founded: 2019 },
  { id: 'd-atelier-vie', name: 'Atelier Vie', independent: true, bio: 'Made-to-order occasion wear, one seamstress at a time.', founded: 2022 },
  { id: 'd-northbloom', name: 'Northbloom Studio', independent: true, bio: 'Botanical-inspired decor & tablescapes.', founded: 2020 },
  { id: 'd-verona', name: 'Verona Label', independent: false, bio: 'Contemporary ready-to-wear, wholesale partner.', founded: 2010 },
  { id: 'd-castleigh', name: 'Castleigh Home', independent: false, bio: 'National home goods brand.', founded: 2005 },
  { id: 'd-mira', name: 'Mira Studio', independent: true, bio: 'Modern minimalist jewelry & accessories.', founded: 2023 },
  { id: 'd-sable', name: 'Sable & Sun', independent: true, bio: 'Coastal-inspired apparel, dyed by hand.', founded: 2018 },
];

const VIBES = ['minimalist', 'boho', 'glam', 'cozy', 'modern', 'vintage', 'coastal', 'edgy'];
const PALETTES = ['neutral', 'pastel', 'bold', 'monochrome'];

function d(id) {
  const found = DESIGNERS.find((x) => x.id === id);
  if (!found) throw new Error(`Unknown designer ${id}`);
  return found;
}

const PRODUCTS = [
  // ---------- FASHION ----------
  { id: 'p1', name: 'Ivory Ribbed Knit Sweater', category: 'fashion', subcategory: 'tops', price: 68, vibes: ['minimalist', 'cozy'], palette: 'neutral', budgetTier: 'mid', designer: d('d-luma'), sponsored: false, rating: 4.7, emoji: '🧶', gradient: 'linear-gradient(135deg,#f3ede3,#e5d9c8)' },
  { id: 'p2', name: 'Rust Suede Midi Skirt', category: 'fashion', subcategory: 'bottoms', price: 92, vibes: ['boho', 'vintage'], palette: 'bold', budgetTier: 'mid', designer: d('d-sable'), sponsored: false, rating: 4.5, emoji: '👗', gradient: 'linear-gradient(135deg,#c97a52,#8f4a2e)' },
  { id: 'p3', name: 'Sequin Slip Dress', category: 'fashion', subcategory: 'dresses', price: 210, vibes: ['glam'], palette: 'bold', budgetTier: 'luxury', designer: d('d-atelier-vie'), sponsored: true, rating: 4.9, emoji: '✨', gradient: 'linear-gradient(135deg,#d4af37,#b48811)' },
  { id: 'p4', name: 'Structured Blazer, Sand', category: 'fashion', subcategory: 'outerwear', price: 145, vibes: ['minimalist', 'modern'], palette: 'neutral', budgetTier: 'mid', designer: d('d-verona'), sponsored: false, rating: 4.6, emoji: '🧥', gradient: 'linear-gradient(135deg,#e9e2d6,#cfc3ac)' },
  { id: 'p5', name: 'Hand-dyed Linen Wrap Top', category: 'fashion', subcategory: 'tops', price: 54, vibes: ['boho', 'coastal'], palette: 'pastel', budgetTier: 'budget', designer: d('d-sable'), sponsored: false, rating: 4.4, emoji: '🌾', gradient: 'linear-gradient(135deg,#f4e6d7,#e9c9a0)' },
  { id: 'p6', name: 'Velvet Tailored Trousers', category: 'fashion', subcategory: 'bottoms', price: 118, vibes: ['glam', 'edgy'], palette: 'monochrome', budgetTier: 'luxury', designer: d('d-verona'), sponsored: false, rating: 4.5, emoji: '🖤', gradient: 'linear-gradient(135deg,#2b2b2b,#000000)' },
  { id: 'p7', name: 'Cloud Knit Cardigan', category: 'fashion', subcategory: 'outerwear', price: 76, vibes: ['cozy', 'minimalist'], palette: 'pastel', budgetTier: 'mid', designer: d('d-luma'), sponsored: false, rating: 4.8, emoji: '☁️', gradient: 'linear-gradient(135deg,#f6e9f0,#e9d3e3)' },
  { id: 'p8', name: 'Retro Polka Dot Blouse', category: 'fashion', subcategory: 'tops', price: 48, vibes: ['vintage'], palette: 'bold', budgetTier: 'budget', designer: d('d-atelier-vie'), sponsored: false, rating: 4.3, emoji: '🎀', gradient: 'linear-gradient(135deg,#e5556b,#b7233a)' },
  { id: 'p9', name: 'Minimal Gold Hoop Set', category: 'fashion', subcategory: 'accessories', price: 32, vibes: ['minimalist', 'modern'], palette: 'neutral', budgetTier: 'budget', designer: d('d-mira'), sponsored: true, rating: 4.7, emoji: '💍', gradient: 'linear-gradient(135deg,#e9d8a6,#c9a227)' },
  { id: 'p10', name: 'Faux Leather Moto Jacket', category: 'fashion', subcategory: 'outerwear', price: 132, vibes: ['edgy', 'modern'], palette: 'monochrome', budgetTier: 'mid', designer: d('d-verona'), sponsored: false, rating: 4.4, emoji: '🏍️', gradient: 'linear-gradient(135deg,#3a3a3a,#111111)' },
  { id: 'p11', name: 'Sun-bleached Denim Set', category: 'fashion', subcategory: 'bottoms', price: 88, vibes: ['coastal', 'boho'], palette: 'neutral', budgetTier: 'mid', designer: d('d-sable'), sponsored: false, rating: 4.2, emoji: '🌊', gradient: 'linear-gradient(135deg,#cfe0e8,#9fb9c7)' },
  { id: 'p12', name: 'Pearl-embellished Clutch', category: 'fashion', subcategory: 'accessories', price: 96, vibes: ['glam', 'vintage'], palette: 'pastel', budgetTier: 'luxury', designer: d('d-mira'), sponsored: false, rating: 4.6, emoji: '👛', gradient: 'linear-gradient(135deg,#f3e6ee,#dcc4d8)' },
  { id: 'p13', name: 'Organic Cotton Lounge Set', category: 'fashion', subcategory: 'loungewear', price: 62, vibes: ['cozy', 'minimalist'], palette: 'neutral', budgetTier: 'budget', designer: d('d-luma'), sponsored: false, rating: 4.8, emoji: '🛋️', gradient: 'linear-gradient(135deg,#eee6da,#d9c9b3)' },
  { id: 'p14', name: 'Statement Puff-sleeve Gown', category: 'fashion', subcategory: 'dresses', price: 265, vibes: ['glam', 'vintage'], palette: 'bold', budgetTier: 'luxury', designer: d('d-atelier-vie'), sponsored: false, rating: 4.9, emoji: '👑', gradient: 'linear-gradient(135deg,#7a2048,#4a0f2c)' },
  { id: 'p30', name: 'Woven Raffia Espadrille Wedges', category: 'fashion', subcategory: 'shoes', price: 78, vibes: ['coastal', 'boho'], palette: 'neutral', budgetTier: 'mid', designer: d('d-sable'), sponsored: false, rating: 4.6, emoji: '👡', gradient: 'linear-gradient(135deg,#e6cfa0,#b8925c)' },

  // ---------- HOME ----------
  { id: 'p15', name: 'Terracotta Ribbed Vase', category: 'home', subcategory: 'decor', price: 38, vibes: ['boho', 'minimalist'], palette: 'neutral', budgetTier: 'budget', designer: d('d-northbloom'), sponsored: false, rating: 4.6, emoji: '🏺', gradient: 'linear-gradient(135deg,#d98c5f,#a85c34)' },
  { id: 'p16', name: 'Boucle Accent Chair', category: 'home', subcategory: 'furniture', price: 420, vibes: ['modern', 'cozy'], palette: 'neutral', budgetTier: 'luxury', designer: d('d-castleigh'), sponsored: true, rating: 4.7, emoji: '🪑', gradient: 'linear-gradient(135deg,#efe9df,#d6cdbd)' },
  { id: 'p17', name: 'Chunky Knit Throw Blanket', category: 'home', subcategory: 'textiles', price: 74, vibes: ['cozy', 'minimalist'], palette: 'neutral', budgetTier: 'mid', designer: d('d-fernweh'), sponsored: false, rating: 4.9, emoji: '🧵', gradient: 'linear-gradient(135deg,#f1e8dd,#dccbb0)' },
  { id: 'p18', name: 'Brass & Glass Coffee Table', category: 'home', subcategory: 'furniture', price: 380, vibes: ['glam', 'modern'], palette: 'monochrome', budgetTier: 'luxury', designer: d('d-castleigh'), sponsored: false, rating: 4.5, emoji: '🛋️', gradient: 'linear-gradient(135deg,#cbb26a,#8a7434)' },
  { id: 'p19', name: 'Dried Botanical Wreath', category: 'home', subcategory: 'decor', price: 44, vibes: ['boho', 'coastal'], palette: 'pastel', budgetTier: 'budget', designer: d('d-northbloom'), sponsored: false, rating: 4.4, emoji: '🌿', gradient: 'linear-gradient(135deg,#e7ead9,#c3cba6)' },
  { id: 'p20', name: 'Hand-thrown Ceramic Dinnerware Set', category: 'home', subcategory: 'tableware', price: 128, vibes: ['minimalist', 'vintage'], palette: 'neutral', budgetTier: 'mid', designer: d('d-fernweh'), sponsored: false, rating: 4.8, emoji: '🍽️', gradient: 'linear-gradient(135deg,#ece3d5,#cbb99e)' },
  { id: 'p21', name: 'Velvet Jewel-tone Throw Pillows (2)', category: 'home', subcategory: 'textiles', price: 58, vibes: ['glam', 'bold'], palette: 'bold', budgetTier: 'budget', designer: d('d-castleigh'), sponsored: false, rating: 4.3, emoji: '🛏️', gradient: 'linear-gradient(135deg,#5b2c6f,#2e1338)' },
  { id: 'p22', name: 'Rattan Pendant Light', category: 'home', subcategory: 'lighting', price: 96, vibes: ['boho', 'coastal'], palette: 'neutral', budgetTier: 'mid', designer: d('d-northbloom'), sponsored: false, rating: 4.6, emoji: '💡', gradient: 'linear-gradient(135deg,#e3c9a0,#b8925c)' },
  { id: 'p23', name: 'Marble & Black Steel Bookend Set', category: 'home', subcategory: 'decor', price: 52, vibes: ['modern', 'minimalist'], palette: 'monochrome', budgetTier: 'mid', designer: d('d-castleigh'), sponsored: false, rating: 4.5, emoji: '📚', gradient: 'linear-gradient(135deg,#d8d8d8,#3a3a3a)' },
  { id: 'p24', name: 'Linen Duvet Set, Sage', category: 'home', subcategory: 'textiles', price: 148, vibes: ['minimalist', 'cozy'], palette: 'pastel', budgetTier: 'mid', designer: d('d-fernweh'), sponsored: true, rating: 4.8, emoji: '🛌', gradient: 'linear-gradient(135deg,#dbe4d3,#b7c7a8)' },
  { id: 'p25', name: 'Vintage-inspired Brass Mirror', category: 'home', subcategory: 'decor', price: 165, vibes: ['vintage', 'glam'], palette: 'neutral', budgetTier: 'luxury', designer: d('d-northbloom'), sponsored: false, rating: 4.7, emoji: '🪞', gradient: 'linear-gradient(135deg,#cdb26a,#8f7534)' },
  { id: 'p26', name: 'Woven Seagrass Storage Baskets (3)', category: 'home', subcategory: 'storage', price: 66, vibes: ['coastal', 'minimalist'], palette: 'neutral', budgetTier: 'budget', designer: d('d-fernweh'), sponsored: false, rating: 4.5, emoji: '🧺', gradient: 'linear-gradient(135deg,#e4d3ad,#c2a26a)' },
  { id: 'p27', name: 'Moody Floral Wallpaper Panel', category: 'home', subcategory: 'decor', price: 89, vibes: ['vintage', 'bold'], palette: 'bold', budgetTier: 'mid', designer: d('d-castleigh'), sponsored: false, rating: 4.2, emoji: '🖼️', gradient: 'linear-gradient(135deg,#3c1f3d,#1c0d1e)' },
  { id: 'p28', name: 'Scalloped Edge Ceramic Planter', category: 'home', subcategory: 'decor', price: 34, vibes: ['cozy', 'boho'], palette: 'pastel', budgetTier: 'budget', designer: d('d-northbloom'), sponsored: false, rating: 4.6, emoji: '🪴', gradient: 'linear-gradient(135deg,#f2ddd8,#dcb3ab)' },
  { id: 'p29', name: 'Handwoven Jute & Wool Area Rug', category: 'home', subcategory: 'rugs', price: 145, vibes: ['boho', 'coastal'], palette: 'neutral', budgetTier: 'mid', designer: d('d-fernweh'), sponsored: false, rating: 4.7, emoji: '🟤', gradient: 'linear-gradient(135deg,#e3d1ab,#a9835a)' },
];

const VIP_TIERS = [
  { id: 'style-edit', name: 'Style Edit', focus: 'fashion', price: 49, cadence: 'monthly', description: '3-5 AI-curated fashion pieces picked for your vibe, swapped every month.' },
  { id: 'home-refresh', name: 'Home Refresh', focus: 'home', price: 69, cadence: 'monthly', description: 'Seasonal decor & textile refresh box for one room at a time.' },
  { id: 'full-dollhouse', name: 'Full Dollhouse', focus: 'both', price: 99, cadence: 'monthly', description: 'The complete edit — fashion + home, our stylists\' top picks, first access to new designers.' },
];

module.exports = { DESIGNERS, PRODUCTS, VIBES, PALETTES, VIP_TIERS };
