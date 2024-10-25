const fetch = require('node-fetch');
require('dotenv').config();

exports.handler = async function(event, context) {
  const { observation } = JSON.parse(event.body);

  if (!observation) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'No observation provided.' })
    };
  }

  // Your OpenAI API key
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  // The prompt and categories would be similar to the ones used earlier
  const prompt = `Given the following safety observation: "${observation}", identify the most appropriate category, subcategory, and item from the provided list.\n\nCategories:\n...`; // Include your categories here

  try {
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 150,
        temperature: 0
      })
    });

    const data = await response.json();

    if (data.error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: data.error.message })
      };
    }

    const result = data.choices[0].text.trim();

    return {
      statusCode: 200,
      body: JSON.stringify({ result })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred while processing your observation.' })
    };
  }
};
