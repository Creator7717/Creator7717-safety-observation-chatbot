// api/categorize_observation.js
 
module.exports = async function handler(request, response) {
  // Set CORS headers
  response.setHeader('Access-Control-Allow-Origin', 'https://creator7717.github.io'); // Update this to your frontend domain
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
 
  // Handle preflight OPTIONS request
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }
 
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }
 
  // Parse the observation from the request body
  let observation;
  try {
    observation = request.body.observation;
  } catch (error) {
    console.error('Error parsing request body:', error);
    return response.status(400).json({ error: 'Invalid request body.' });
  }
 
  if (!observation) {
    return response.status(400).json({ error: 'No observation provided.' });
  }
 
  // Your OpenAI API key
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
 
  // Categories data embedded directly in the code
  const categoriesData = {
    "categories": [
   [
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
        "name": "Poor Housekeeping",
        "items": [
          { "code": "3a.2.1", "name": "Spillage of Material/Waste" },
          { "code": "3a.2.2", "name": "Job completed but material still at site" },
          { "code": "3a.2.3", "name": "Blocked pathway/walkway/Emergency Exits" },
          { "code": "3a.2.4", "name": "Vegetation Developed" },
          { "code": "3a.2.5", "name": "Improper Segregation" },
          { "code": "3a.2.6", "name": "Storm Water Drain Obstruction" }
        ]
      },
      {
        "code": "3a.3",
        "name": "Equipment Condition",
        "items": [
          { "code": "3a.3.1", "name": "Dust accumulation" },
          { "code": "3a.3.2", "name": "Spillage of Grease" },
          { "code": "3a.3.3", "name": "Heavy vibration" },
          { "code": "3a.3.4", "name": "High Noise" },
          { "code": "3a.3.5", "name": "High Temperature" },
          { "code": "3a.3.6", "name": "Light fitting in damaged condition" },
          { "code": "3a.3.7", "name": "Missing Component" }
        ]
      },
      {
        "code": "3a.4",
        "name": "Structure/Foundation",
        "items": [
          { "code": "3a.4.1", "name": "Crack in Structure" },
          { "code": "3a.4.2", "name": "Worn Out/Rusted" },
          { "code": "3a.4.3", "name": "Missing Component" },
          { "code": "3a.4.4", "name": "Bent in structure" },
          { "code": "3a.4.5", "name": "Structural Instability" },
          { "code": "3a.4.6", "name": "Vegetation Developed" },
          { "code": "3a.4.7", "name": "Peeling of paint/Painting" }
        ]
      },
      {
        "code": "3a.5",
        "name": "Management of Change",
        "items": [
          { "code": "3a.5.1", "name": "Process" },
          { "code": "3a.5.2", "name": "Equipment" },
          { "code": "3a.5.3", "name": "Facility" },
          { "code": "3a.5.4", "name": "People" }
        ]
      }
    ]
  },
  {
    "code": "3B",
    "name": "Position of People",
    "subcategories": [
      {
        "code": "3B.1",
        "name": "Ergonomics",
        "items": [
          { "code": "3B.1.1", "name": "Improper Posture" },
          { "code": "3B.1.2", "name": "Repetitive Movements" },
          { "code": "3B.1.3", "name": "Awkward Posture" },
          { "code": "3B.1.4", "name": "Vibration" },
          { "code": "3B.1.5", "name": "Work Area Design" },
          { "code": "3B.1.6", "name": "Improper Load Handling" },
          { "code": "3B.1.7", "name": "Bending" },
          { "code": "3B.1.8", "name": "Twisting" }
        ]
      },
      {
        "code": "3B.2",
        "name": "Safe Position",
        "items": [
          { "code": "3B.2.1", "name": "Safe Position" }
        ]
      }
    ]
  }
]

          
  
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
 
  // Prepare the messages for OpenAI Chat Completion
  const messages = [
    {
      "role": "system",
      "content": `You are an assistant that categorizes safety observations into predefined categories, subcategories, and items based on the provided list.`
    },
    {
      "role": "user",
      "content": `
Given the following safety observation: "${observation}", identify the most appropriate category, subcategory, and item from the provided list.
 
Categories:
${categoriesText}
 
Respond with the codes and names in the following format:
Category Code - Category Name > Subcategory Code - Subcategory Name > Item Code - Item Name.
`
    }
  ];
 
  try {
    // Call the OpenAI Chat Completions API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4', // Use 'gpt-3.5-turbo' if 'gpt-4' is not available
        messages: messages,
        max_tokens: 150,
        temperature: 0
      })
    });
 
    const data = await openaiResponse.json();
 
    if (data.error) {
      console.error('OpenAI API error:', data.error);
      return response.status(500).json({ error: data.error.message });
    }
 
    const resultText = data.choices[0].message.content.trim();
 
    // Parse the result
    const parsedResult = parseResult(resultText);
 
    return response.status(200).json({ result: parsedResult });
  } catch (error) {
    console.error('Error:', error);
    return response.status(500).json({ error: 'An error occurred while processing your observation.' });
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
 
