export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Make sure your Vercel Environment Variable is named exactly GROQ_API_KEY
    const apiKey = process.env.GROQ_API_KEY || process.env.REACT_APP_GROQ_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key is missing in Vercel Environment Variables.' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    // Securely bypasses the browser by making the request from Vercel's backend
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b', // Your preferred working model
        messages: body.messages,
        temperature: 0.5,
        max_tokens: 1024
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({ error: data.error?.message || 'Groq API rejected the request.' });
    }

    res.status(200).json({ reply: data.choices[0]?.message?.content });

  } catch (error) {
    res.status(500).json({ error: `Vercel API Crashed: ${error.message}` });
  }
}
