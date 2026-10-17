export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Automatically grabs the key you saved in Vercel's Environment Variables
    const apiKey = process.env.REACT_APP_GROQ_API_KEY || process.env.GROQ_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key is missing in Vercel Environment Variables.' });
    }

    // Safely parse body data coming from your React frontend
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    // Securely bypasses the browser by making the request from Vercel's server
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b', // The exact model you confirmed works
        messages: body.messages,
        temperature: 0.2, // Strict temperature to enforce the Math Ban
        max_tokens: 1024
      })
    });

    const data = await response.json();

    // If Groq rejects it, pass the exact error message back to the chat box
    if (!response.ok) {
      return res.status(400).json({ error: `Groq Error: ${data.error?.message || 'Unknown API Rejection'}` });
    }

    res.status(200).json({ reply: data.choices[0]?.message?.content });

  } catch (error) {
    res.status(500).json({ error: `Vercel API Crashed: ${error.message}` });
  }
}
