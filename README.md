mkdir chatbot-backend
cd chatbot-backend
npm init -y
npm install express axios dotenv body-parser
chatbot-backend/
├── .env
├── index.js
└── routes/
    └── ai.js
OPENAI_API_KEY=your-api-key-here
// index.js
const express = require('express');
const bodyParser = require('body-parser');
const aiRoutes = require('./routes/ai');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/ai', aiRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// routes/ai.js
const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

// OpenAI API call
const getAIResponse = async (message, tone = 'friendly') => {
  const prompt = `You are a helpful assistant. The conversation tone is ${tone}. Respond to the user's message: ${message}`;
  
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'gpt-4',  // or use 'gpt-3.5-turbo' for GPT-3.5
        prompt: prompt,
        max_tokens: 150,
        temperature: 0.7, // Adjust temperature for randomness
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error calling OpenAI API', error);
    return 'Sorry, I could not process that request.';
  }
};

// Endpoint for handling chatbot messages
router.post('/message', async (req, res) => {
  const { message, tone } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    const aiResponse = await getAIResponse(message, tone);
    return res.json({ response: aiResponse });
  } catch (error) {
    return res.status(500).json({ error: 'Error processing your request.' });
  }
});

module.exports = router;

