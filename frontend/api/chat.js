import Groq from 'groq-sdk';

const groq = new Groq({ 
  // Vercel securely pulls your key from its environment variables
  apiKey: process.env.REACT_APP_GROQ_API_KEY || process.env.GROQ_API_KEY
});

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { messages } = req.body;

    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: 'llama3-8b-8192', 
      temperature: 0.2, // Strict temperature for guardrails
      max_tokens: 1024,
    });

    res.status(200).json({ reply: chatCompletion.choices[0]?.message?.content });
  } catch (error) {
    console.error("Groq Vercel API Error:", error);
    res.status(500).json({ error: 'AI processing failed' });
  }
}
