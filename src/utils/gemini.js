export const generateStrategy = async (prompt, customKey) => {
  // Looks for Netlify environment variable first, falls back to local key
  const envKey = import.meta.env ? import.meta.env.VITE_GEMINI_API_KEY : null;
  const apiKey = envKey || customKey;
  
  if (!apiKey) throw new Error("API Key missing. Configure in Workspace settings or Netlify Env Variables.");

  const systemPrompt = `You are Octo-Flow, an AI strategist. User Idea: "${prompt}". Generate a VALID JSON object with exactly these 8 keys. Do not include markdown formatting. { "twitter": "Tweet hook", "linkedin": "LinkedIn opener", "seo": "5 keywords", "email": "Email subject/opener", "tagline": "Slogan", "competitors": "3 competitors", "persona": "Persona", "image_prompt": "Image gen prompt" }`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] })
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);

  let text = data.candidates[0].content.parts[0].text;
  text = text.replace(/```json/g, '').replace(/```/g, '');
  return JSON.parse(text);
};