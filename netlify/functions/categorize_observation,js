const fetch = require('node-fetch');
const categoriesData = require('./categories.json');

exports.handler = async function(event, context) {
  // Add CORS headers to the response
  const headers = {
    'Access-Control-Allow-Origin': 'https://creator7717.github.io', // Replace with your GitHub Pages URL
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: 'OK',
    };
  }

  // Parse the observation from the request body
  const { observation } = JSON.parse(event.body);

  if (!observation) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'No observation provided.' }),
    };
  }

  // Your OpenAI API key
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  // Convert categories JSON to text format
  function categoriesToText(categories) {
    let text = '';
    categories.forEach(category => {
      text += `- ${category.code}: ${category.name}\n`;
      category.subcategories.forEach(subcategory => {
        text += `  - ${subcategory.code}: ${subcategory.name}\n`;
        subcategory.items.forEach(item => {
          text += `    - ${item.code}: ${item.name}\n`;
        });
      });
    });
    return text;
  }

  const categoriesText = categoriesToText(categoriesData.categories);

  // Prepare the prompt for OpenAI
  const prompt = `
Given the following safety observation: "${observation}", identify the most appropriate category, subcategory, and item from the provided list.

Categories:
${categoriesText}

Respond with the codes and names in the following format:
Category Code - Category Name > Subcategory Code - Subcategory Name > Item Code - Item Name.
`;

  try {
    // Call the OpenAI API
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
        headers,
        body: JSON.stringify({ error: data.error.message })
      };
    }

    const resultText = data.choices[0].text.trim();

    // Parse the result
    const parsedResult = parseResult(resultText);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ result: parsedResult })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'An error occurred while processing your observation.' })
    };
  }
};

// Function to parse the OpenAI response into structured data
function parseResult(resultText) {
  // Expected format:
  // Category Code - Category Name > Subcategory Code - Subcategory Name > Item Code - Item Name

  const parts = resultText.split('>');
  if (parts.length === 3) {
    const [categoryPart, subcategoryPart, itemPart] = parts.map(part => part.trim());

    const [categoryCode, categoryName] = categoryPart.split('-', 2).map(str => str.trim());
    const [subcategoryCode, subcategoryName] = subcategoryPart.split('-', 2).map(str => str.trim());
    const [itemCode, itemName] = itemPart.split('-', 2).map(str => str.trim());

    return {
      categoryCode,
      categoryName,
      subcategoryCode,
      subcategoryName,
      itemCode,
      itemName
    };
  } else {
    // If the format is unexpected, return the raw text
    return { rawResult: resultText };
  }
}

