// categorize_observation.js

const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Set CORS headers for all responses
  const headers = {
    'Access-Control-Allow-Origin': 'https://creator7717.github.io',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({})
    };
  }

  // Parse the observation from the request body
  let observation;
  try {
    const body = JSON.parse(event.body);
    observation = body.observation;
  } catch (error) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid request body.' })
    };
  }

  if (!observation) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'No observation provided.' })
    };
  }

  // Your OpenAI API key
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  // Categories data embedded directly in the code
  const categoriesData = {
    "categories": [
      {
        "code": "3a",
        "name": "Plant Upkeep",
        "subcategories": [
          {
            "code": "3a.1",
            "name": "Leakage",
            "items": [
              { "code": "3a.1.1", "name": "Air" },
              { "code": "3a.1.2", "name": "Oil" },
              { "code": "3a.1.3", "name": "Water" },
              { "code": "3a.1.4", "name": "Steam" },
              { "code": "3a.1.5", "name": "Chemical" },
              { "code": "3a.1.6", "name": "Gas" },
              { "code": "3a.1.7", "name": "Polymer" }
            ]
          },
          {
            "code": "3a.2",
            "name": "Spillage",
            "items": [
              { "code": "3a.2.1", "name": "Raw Material" },
              { "code": "3a.2.2", "name": "Product" },
              { "code": "3a.2.3", "name": "Waste" },
              { "code": "3a.2.4", "name": "Oil" },
              { "code": "3a.2.5", "name": "Chemical" }
            ]
          },
          // Include all other subcategories and items...
        ]
      },
      // Include all other categories...
    ]
  };

  // Convert categories JSON to text format
  function categoriesToText(categories) {
    let text = '';
    categories.forEach(category => {
      text += - ${category.code}: ${category.name}\n;
      category.subcategories.forEach(subcategory => {
        text +=   - ${subcategory.code}: ${subcategory.name}\n;
        subcategory.items.forEach(item => {
          text +=     - ${item.code}: ${item.name}\n;
        });
      });
    });
    return text;
  }

  const categoriesText = categoriesToText(categoriesData.categories);

  // Prepare the prompt for OpenAI
  const prompt = 
Given the following safety observation: "${observation}", identify the most appropriate category, subcategory, and item from the provided list.

Categories:
${categoriesText}

Respond with the codes and names in the following format:
Category Code - Category Name > Subcategory Code - Subcategory Name > Item Code - Item Name.
;

  try {
    // Call the OpenAI API
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': Bearer ${OPENAI_API_KEY}
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
