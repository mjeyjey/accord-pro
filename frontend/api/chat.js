export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Automatically grabs the key you saved in Vercel's Environment Variables
    const apiKey = process.env.REACT_APP_GROQ_API_KEY || process.env.GROQ_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key is missing.' });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: req.body.messages,
        temperature: 0.2,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Groq API rejected the request.' });
    }

    const data = await response.json();
    res.status(200).json({ reply: data.choices[0]?.message?.content });

  } catch (error) {
    res.status(500).json({ error: 'Vercel function crashed.' });
  }
}
