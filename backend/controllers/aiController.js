const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Gemini AI client using our API key from .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// This instruction tells the AI how to behave for every conversation
const SYSTEM_INSTRUCTION = `You are a compassionate and knowledgeable women's safety assistant for an app called She Shield. 
Your job is to:
- Give practical, actionable safety advice (travel safety, night safety, workplace safety, online safety)
- Provide emergency guidance calmly and clearly
- Suggest safe route practices and crime awareness tips
- Be supportive and non-judgmental
- Keep responses concise (under 150 words) unless the user asks for detail
- If someone describes an active emergency, immediately advise them to contact local emergency services and use the app's SOS button
Never give medical, legal, or law enforcement advice beyond general safety guidance - always recommend professional help for those.`;

// CHAT - sends a user message to Gemini and returns the AI's reply
exports.chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ message: 'Message cannot be empty' });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash', // fast and free-tier friendly
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const result = await model.generateContent(message);
    const aiReply = result.response.text();

    res.status(200).json({ reply: aiReply });
  } catch (error) {
    res.status(500).json({ message: 'AI chatbot failed to respond', error: error.message });
  }
};

// MOOD DETECTION - analyzes text and returns a simple mood label
exports.detectMood = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Text cannot be empty' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Analyze the emotional tone of this message and respond with ONLY one word from this list: calm, anxious, scared, distressed, neutral, happy. 
Message: "${text}"
Respond with just the single word, nothing else.`;

    const result = await model.generateContent(prompt);
    const mood = result.response.text().trim().toLowerCase();

    res.status(200).json({ mood });
  } catch (error) {
    res.status(500).json({ message: 'Mood detection failed', error: error.message });
  }
};