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
              { "code": "3B.1.3", "name": "Awkward Posture" }, // Corrected typo
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
      },
      {
        "code": "3C",
        "name": "Reaction of People",
        "subcategories": [
          {
            "code": "3C.1",
            "name": "Adjusting PPE",
            "items": [
              { "code": "3C.1.1", "name": "Adjusting PPE" }
            ]
          },
          {
            "code": "3C.2",
            "name": "Changing Position",
            "items": [
              { "code": "3C.2.1", "name": "Changing Position" }
            ]
          },
          {
            "code": "3C.3",
            "name": "Rearranging the workplace",
            "items": [
              { "code": "3C.3.1", "name": "Rearranging the workplace" }
            ]
          },
          {
            "code": "3C.4",
            "name": "Stopping a job",
            "items": [
              { "code": "3C.4.1", "name": "Stopping a job" }
            ]
          },
          {
            "code": "3C.5",
            "name": "Evacuation action (run & hide)",
            "items": [
              { "code": "3C.5.1", "name": "Evacuation action (run & hide)" }
            ]
          },
          {
            "code": "3C.6",
            "name": "Correcting (his/her) own behaviour / work practices",
            "items": [
              { "code": "3C.6.1", "name": "Correcting (his/her) own behaviour / work practices" }
            ]
          }
        ]
      },
      {
  "code": "3d",
  "name": "Tools & Equipments",
  "subcategories": [
    {
      "code": "3d.1",
      "name": "Damaged Tool",
      "items": [
        { "code": "3d.1.1", "name": "Screw driver" },
        { "code": "3d.1.2", "name": "Hammer" },
        { "code": "3d.1.3", "name": "Saw" },
        { "code": "3d.1.4", "name": "File" },
        { "code": "3d.1.5", "name": "Mallet" },
        { "code": "3d.1.6", "name": "Chisel" },
        { "code": "3d.1.7", "name": "Wrench" },
        { "code": "3d.1.8", "name": "Level ax" },
        { "code": "3d.1.9", "name": "PLier" },
        { "code": "3d.1.10", "name": "Clamp" },
        { "code": "3d.1.11", "name": "Bolt cutter" },
        { "code": "3d.1.12", "name": "Shears" },
        { "code": "3d.1.13", "name": "Vise" },
        { "code": "3d.1.14", "name": "Showel" },
        { "code": "3d.1.15", "name": "Heat gun" },
        { "code": "3d.1.16", "name": "Jack hammer" },
        { "code": "3d.1.17", "name": "Circular saw" },
        { "code": "3d.1.18", "name": "Nail gun" },
        { "code": "3d.1.19", "name": "Sander" },
        { "code": "3d.1.20", "name": "Lathe" },
        { "code": "3d.1.21", "name": "Sledge hammer" },
        { "code": "3d.1.22", "name": "Scraper" },
        { "code": "3d.1.23", "name": "Dril Machine" },
        { "code": "3d.1.24", "name": "Earth Pit" },
        { "code": "3d.1.25", "name": "ELCB/MCCB" },
        { "code": "3d.1.26", "name": "EOT/Hoist" },
        { "code": "3d.1.27", "name": "Grinder" },
        { "code": "3d.1.28", "name": "Welding machine" },
        { "code": "3d.1.29", "name": "Multimeter" },
        { "code": "3d.1.30", "name": "Gas Monitors" }
      ]
    },
    {
      "code": "3d.2",
      "name": "Non Standard Tool",
      "items": [
        { "code": "3d.2.1", "name": "Screw driver" },
        { "code": "3d.2.2", "name": "Hammer" },
        { "code": "3d.2.3", "name": "Saw" },
        { "code": "3d.2.4", "name": "File" },
        { "code": "3d.2.5", "name": "Mallet" },
        { "code": "3d.2.6", "name": "Chisel" },
        { "code": "3d.2.7", "name": "Wrench" },
        { "code": "3d.2.8", "name": "Level ax" },
        { "code": "3d.2.9", "name": "PLier" },
        { "code": "3d.2.10", "name": "Clamp" },
        { "code": "3d.2.11", "name": "Bolt cutter" },
        { "code": "3d.2.12", "name": "Shears" },
        { "code": "3d.2.13", "name": "Vise" },
        { "code": "3d.2.14", "name": "Showel" },
        { "code": "3d.2.15", "name": "Heat gun" },
        { "code": "3d.2.16", "name": "Jack hammer" },
        { "code": "3d.2.17", "name": "Circular saw" },
        { "code": "3d.2.18", "name": "Nail gun" },
        { "code": "3d.2.19", "name": "Sander" },
        { "code": "3d.2.20", "name": "Lathe" },
        { "code": "3d.2.21", "name": "Sledge hammer" },
        { "code": "3d.2.22", "name": "Scraper" },
        { "code": "3d.2.23", "name": "Dril Machine" },
        { "code": "3d.2.24", "name": "Earth Pit" },
        { "code": "3d.2.25", "name": "ELCB/MCCB" },
        { "code": "3d.2.26", "name": "EOT/Hoist" },
        { "code": "3d.2.27", "name": "Grinder" },
        { "code": "3d.2.28", "name": "Welding machine" },
        { "code": "3d.2.29", "name": "Multimeter" },
        { "code": "3d.2.30", "name": "Gas Monitors" }
      ]
    },
    {
      "code": "3d.3",
      "name": "Left Tool Unattended",
      "items": [
        { "code": "3d.3.1", "name": "Screw driver" },
        { "code": "3d.3.2", "name": "Hammer" },
        { "code": "3d.3.3", "name": "Saw" },
        { "code": "3d.3.4", "name": "File" },
        { "code": "3d.3.5", "name": "Mallet" },
        { "code": "3d.3.6", "name": "Chisel" },
        { "code": "3d.3.7", "name": "Wrench" },
        { "code": "3d.3.8", "name": "Level ax" },
        { "code": "3d.3.9", "name": "PLier" },
        { "code": "3d.3.10", "name": "Clamp" },
        { "code": "3d.3.11", "name": "Bolt cutter" },
        { "code": "3d.3.12", "name": "Shears" },
        { "code": "3d.3.13", "name": "Vise" },
        { "code": "3d.3.14", "name": "Showel" },
        { "code": "3d.3.15", "name": "Heat gun" },
        { "code": "3d.3.16", "name": "Jack hammer" },
        { "code": "3d.3.17", "name": "Circular saw" },
        { "code": "3d.3.18", "name": "Nail gun" },
        { "code": "3d.3.19", "name": "Sander" },
        { "code": "3d.3.20", "name": "Lathe" },
        { "code": "3d.3.21", "name": "Sledge hammer" },
        { "code": "3d.3.22", "name": "Scraper" },
        { "code": "3d.3.23", "name": "Dril Machine" },
        { "code": "3d.3.24", "name": "Earth Pit" },
        { "code": "3d.3.25", "name": "ELCB/MCCB" },
        { "code": "3d.3.26", "name": "EOT/Hoist" },
        { "code": "3d.3.27", "name": "Grinder" },
        { "code": "3d.3.28", "name": "Welding machine" },
        { "code": "3d.3.29", "name": "Multimeter" },
        { "code": "3d.3.30", "name": "Gas Monitors" }
      ]
    },
    {
      "code": "3d.4",
      "name": "Tool Not suitable for Job",
      "items": [
        { "code": "3d.4.1", "name": "Screw driver" },
        { "code": "3d.4.2", "name": "Hammer" },
        { "code": "3d.4.3", "name": "Saw" },
        { "code": "3d.4.4", "name": "File" },
        { "code": "3d.4.5", "name": "Mallet" },
        { "code": "3d.4.6", "name": "Chisel" },
        { "code": "3d.4.7", "name": "Wrench" },
        { "code": "3d.4.8", "name": "Level ax" },
        { "code": "3d.4.9", "name": "PLier" },
        { "code": "3d.4.10", "name": "Clamp" },
        { "code": "3d.4.11", "name": "Bolt cutter" },
        { "code": "3d.4.12", "name": "Shears" },
        { "code": "3d.4.13", "name": "Vise" },
        { "code": "3d.4.14", "name": "Showel" },
        { "code": "3d.4.15", "name": "Heat gun" },
        { "code": "3d.4.16", "name": "Jack hammer" },
        { "code": "3d.4.17", "name": "Circular saw" },
        { "code": "3d.4.18", "name": "Nail gun" },
        { "code": "3d.4.19", "name": "Sander" },
        { "code": "3d.4.20", "name": "Lathe" },
        { "code": "3d.4.21", "name": "Sledge hammer" },
        { "code": "3d.4.22", "name": "Scraper" },
        { "code": "3d.4.23", "name": "Dril Machine" },
        { "code": "3d.4.24", "name": "Earth Pit" },
        { "code": "3d.4.25", "name": "ELCB/MCCB" },
        { "code": "3d.4.26", "name": "EOT/Hoist" },
        { "code": "3d.4.27", "name": "Grinder" },
        { "code": "3d.4.28", "name": "Welding machine" },
        { "code": "3d.4.29", "name": "Multimeter" },
        { "code": "3d.4.30", "name": "Gas Monitors" }
      ]
    },
    {
      "code": "3d.5",
      "name": "Not certified/Tested tools",
      "items": [
        { "code": "3d.5.1", "name": "Screw driver" },
        { "code": "3d.5.2", "name": "Hammer" },
        { "code": "3d.5.3", "name": "Saw" },
        { "code": "3d.5.4", "name": "File" },
        { "code": "3d.5.5", "name": "Mallet" },
        { "code": "3d.5.6", "name": "Chisel" },
        { "code": "3d.5.7", "name": "Wrench" },
        { "code": "3d.5.8", "name": "Level ax" },
        { "code": "3d.5.9", "name": "PLier" },
        { "code": "3d.5.10", "name": "Clamp" },
        { "code": "3d.5.11", "name": "Bolt cutter" },
        { "code": "3d.5.12", "name": "Shears" },
        { "code": "3d.5.13", "name": "Vise" },
        { "code": "3d.5.14", "name": "Showel" },
        { "code": "3d.5.15", "name": "Heat gun" },
        { "code": "3d.5.16", "name": "Jack hammer" },
        { "code": "3d.5.17", "name": "Circular saw" },
        { "code": "3d.5.18", "name": "Nail gun" },
        { "code": "3d.5.19", "name": "Sander" },
        { "code": "3d.5.20", "name": "Lathe" },
        { "code": "3d.5.21", "name": "Sledge hammer" },
        { "code": "3d.5.22", "name": "Scraper" },
        { "code": "3d.5.23", "name": "Dril Machine" },
        { "code": "3d.5.24", "name": "Earth Pit" },
        { "code": "3d.5.25", "name": "ELCB/MCCB" },
        { "code": "3d.5.26", "name": "EOT/Hoist" },
        { "code": "3d.5.27", "name": "Grinder" },
        { "code": "3d.5.28", "name": "Welding machine" },
        { "code": "3d.5.29", "name": "Multimeter" },
        { "code": "3d.5.30", "name": "Gas Monitors" }
      ]
    },
    {
      "code": "3d.6",
      "name": "Damaged Equipement",
      "items": [
        { "code": "3d.6.1", "name": "Screw driver" },
        { "code": "3d.6.2", "name": "Hammer" },
        { "code": "3d.6.3", "name": "Saw" },
        { "code": "3d.6.4", "name": "File" },
        { "code": "3d.6.5", "name": "Mallet" },
        { "code": "3d.6.6", "name": "Chisel" },
        { "code": "3d.6.7", "name": "Wrench" },
        { "code": "3d.6.8", "name": "Level ax" },
        { "code": "3d.6.9", "name": "PLier" },
        { "code": "3d.6.10", "name": "Clamp" },
        { "code": "3d.6.11", "name": "Bolt cutter" },
        { "code": "3d.6.12", "name": "Shears" },
        { "code": "3d.6.13", "name": "Vise" },
        { "code": "3d.6.14", "name": "Showel" },
        { "code": "3d.6.15", "name": "Heat gun" },
        { "code": "3d.6.16", "name": "Jack hammer" },
        { "code": "3d.6.17", "name": "Circular saw" },
        { "code": "3d.6.18", "name": "Nail gun" },
        { "code": "3d.6.19", "name": "Sander" },
        { "code": "3d.6.20", "name": "Lathe" },
        { "code": "3d.6.21", "name": "Sledge hammer" },
        { "code": "3d.6.22", "name": "Scraper" },
        { "code": "3d.6.23", "name": "Dril Machine" },
        { "code": "3d.6.24", "name": "Earth Pit" },
        { "code": "3d.6.25", "name": "ELCB/MCCB" },
        { "code": "3d.6.26", "name": "EOT/Hoist" },
        { "code": "3d.6.27", "name": "Grinder" },
        { "code": "3d.6.28", "name": "Welding machine" },
        { "code": "3d.6.29", "name": "Multimeter" },
        { "code": "3d.6.30", "name": "Gas Monitors" }
      ]
    },
    {
      "code": "3d.7",
      "name": "Not certified/Tested Equipments",
      "items": [
        { "code": "3d.7.1", "name": "Screw driver" },
        { "code": "3d.7.2", "name": "Hammer" },
        { "code": "3d.7.3", "name": "Saw" },
        { "code": "3d.7.4", "name": "File" },
        { "code": "3d.7.5", "name": "Mallet" },
        { "code": "3d.7.6", "name": "Chisel" },
        { "code": "3d.7.7", "name": "Wrench" },
        { "code": "3d.7.8", "name": "Level ax" },
        { "code": "3d.7.9", "name": "PLier" },
        { "code": "3d.7.10", "name": "Clamp" },
        { "code": "3d.7.11", "name": "Bolt cutter" },
        { "code": "3d.7.12", "name": "Shears" },
        { "code": "3d.7.13", "name": "Vise" },
        { "code": "3d.7.14", "name": "Showel" },
        { "code": "3d.7.15", "name": "Heat gun" },
        { "code": "3d.7.16", "name": "Jack hammer" },
        { "code": "3d.7.17", "name": "Circular saw" },
        { "code": "3d.7.18", "name": "Nail gun" },
        { "code": "3d.7.19", "name": "Sander" },
        { "code": "3d.7.20", "name": "Lathe" },
        { "code": "3d.7.21", "name": "Sledge hammer" },
        { "code": "3d.7.22", "name": "Scraper" },
        { "code": "3d.7.23", "name": "Dril Machine" },
        { "code": "3d.7.24", "name": "Earth Pit" },
        { "code": "3d.7.25", "name": "ELCB/MCCB" },
        { "code": "3d.7.26", "name": "EOT/Hoist" },
        { "code": "3d.7.27", "name": "Grinder" },
        { "code": "3d.7.28", "name": "Welding machine" },
        { "code": "3d.7.29", "name": "Multimeter" },
        { "code": "3d.7.30", "name": "Gas Monitors" }
      ]
    },
    {
      "code": "3d.8",
      "name": "Safety Device Bypassed",
      "items": [
        { "code": "3d.8.1", "name": "Screw driver" },
        { "code": "3d.8.2", "name": "Hammer" },
        { "code": "3d.8.3", "name": "Saw" },
        { "code": "3d.8.4", "name": "File" },
        { "code": "3d.8.5", "name": "Mallet" },
        { "code": "3d.8.6", "name": "Chisel" },
        { "code": "3d.8.7", "name": "Wrench" },
        { "code": "3d.8.8", "name": "Level ax" },
        { "code": "3d.8.9", "name": "PLier" },
        { "code": "3d.8.10", "name": "Clamp" },
        { "code": "3d.8.11", "name": "Bolt cutter" },
        { "code": "3d.8.12", "name": "Shears" },
        { "code": "3d.8.13", "name": "Vise" },
        { "code": "3d.8.14", "name": "Showel" },
        { "code": "3d.8.15", "name": "Heat gun" },
        { "code": "3d.8.16", "name": "Jack hammer" },
        { "code": "3d.8.17", "name": "Circular saw" },
        { "code": "3d.8.18", "name": "Nail gun" },
        { "code": "3d.8.19", "name": "Sander" },
        { "code": "3d.8.20", "name": "Lathe" },
        { "code": "3d.8.21", "name": "Sledge hammer" },
        { "code": "3d.8.22", "name": "Scraper" },
        { "code": "3d.8.23", "name": "Dril Machine" },
        { "code": "3d.8.24", "name": "Earth Pit" },
        { "code": "3d.8.25", "name": "ELCB/MCCB" },
        { "code": "3d.8.26", "name": "EOT/Hoist" },
        { "code": "3d.8.27", "name": "Grinder" },
        { "code": "3d.8.28", "name": "Welding machine" },
        { "code": "3d.8.29", "name": "Multimeter" },
        { "code": "3d.8.30", "name": "Gas Monitors" }
      ]
    },
    {
      "code": "3d.9",
      "name": "Safety Device damaged",
      "items": [
        { "code": "3d.9.1", "name": "Screw driver" },
        { "code": "3d.9.2", "name": "Hammer" },
        { "code": "3d.9.3", "name": "Saw" },
        { "code": "3d.9.4", "name": "File" },
        { "code": "3d.9.5", "name": "Mallet" },
        { "code": "3d.9.6", "name": "Chisel" },
        { "code": "3d.9.7", "name": "Wrench" },
        { "code": "3d.9.8", "name": "Level ax" },
        { "code": "3d.9.9", "name": "PLier" },
        { "code": "3d.9.10", "name": "Clamp" },
        { "code": "3d.9.11", "name": "Bolt cutter" },
        { "code": "3d.9.12", "name": "Shears" },
        { "code": "3d.9.13", "name": "Vise" },
        { "code": "3d.9.14", "name": "Showel" },
        { "code": "3d.9.15", "name": "Heat gun" },
        { "code": "3d.9.16", "name": "Jack hammer" },
        { "code": "3d.9.17", "name": "Circular saw" },
        { "code": "3d.9.18", "name": "Nail gun" },
        { "code": "3d.9.19", "name": "Sander" },
        { "code": "3d.9.20", "name": "Lathe" },
        { "code": "3d.9.21", "name": "Sledge hammer" },
        { "code": "3d.9.22", "name": "Scraper" },
        { "code": "3d.9.23", "name": "Dril Machine" },
        { "code": "3d.9.24", "name": "Earth Pit" },
        { "code": "3d.9.25", "name": "ELCB/MCCB" },
        { "code": "3d.9.26", "name": "EOT/Hoist" },
        { "code": "3d.9.27", "name": "Grinder" },
        { "code": "3d.9.28", "name": "Welding machine" },
        { "code": "3d.9.29", "name": "Multimeter" },
        { "code": "3d.9.30", "name": "Gas Monitors" }
      ]
    },
    {
      "code": "3d.10",
      "name": "Safety Device Not Available",
      "items": [
        { "code": "3d.10.1", "name": "Screw driver" },
        { "code": "3d.10.2", "name": "Hammer" },
        { "code": "3d.10.3", "name": "Saw" },
        { "code": "3d.10.4", "name": "File" },
        { "code": "3d.10.5", "name": "Mallet" },
        { "code": "3d.10.6", "name": "Chisel" },
        { "code": "3d.10.7", "name": "Wrench" },
        { "code": "3d.10.8", "name": "Level ax" },
        { "code": "3d.10.9", "name": "PLier" },
        { "code": "3d.10.10", "name": "Clamp" },
        { "code": "3d.10.11", "name": "Bolt cutter" },
        { "code": "3d.10.12", "name": "Shears" },
        { "code": "3d.10.13", "name": "Vise" },
        { "code": "3d.10.14", "name": "Showel" },
        { "code": "3d.10.15", "name": "Heat gun" },
        { "code": "3d.10.16", "name": "Jack hammer" },
        { "code": "3d.10.17", "name": "Circular saw" },
        { "code": "3d.10.18", "name": "Nail gun" },
        { "code": "3d.10.19", "name": "Sander" },
        { "code": "3d.10.20", "name": "Lathe" },
        { "code": "3d.10.21", "name": "Sledge hammer" },
        { "code": "3d.10.22", "name": "Scraper" },
        { "code": "3d.10.23", "name": "Dril Machine" },
        { "code": "3d.10.24", "name": "Earth Pit" },
        { "code": "3d.10.25", "name": "ELCB/MCCB" },
        { "code": "3d.10.26", "name": "EOT/Hoist" },
        { "code": "3d.10.27", "name": "Grinder" },
        { "code": "3d.10.28", "name": "Welding machine" },
        { "code": "3d.10.29", "name": "Multimeter" },
        { "code": "3d.10.30", "name": "Gas Monitors" }
      ]
    }
  ]
},
      {
  "code": "3e",
  "name": "PPE",
  "subcategories": [
    {
      "code": "3e.1",
      "name": "Damaged PPE",
      "items": [
        { "code": "3e.1.1", "name": "Helmet" },
        { "code": "3e.1.2", "name": "Goggles" },
        { "code": "3e.1.3", "name": "Dust mask" },
        { "code": "3e.1.4", "name": "Gas mask" },
        { "code": "3e.1.5", "name": "Ear Plug" },
        { "code": "3e.1.6", "name": "Ear muff" },
        { "code": "3e.1.7", "name": "Hand Gloves" },
        { "code": "3e.1.8", "name": "Coverall" },
        { "code": "3e.1.9", "name": "Chemical Suit" },
        { "code": "3e.1.10", "name": "Leather Apron" },
        { "code": "3e.1.11", "name": "Safety Shoes" },
        { "code": "3e.1.12", "name": "Gum Boot" },
        { "code": "3e.1.13", "name": "Leg Guard" },
        { "code": "3e.1.14", "name": "Balaclava" },
        { "code": "3e.1.15", "name": "Reflective Jacket" },
        { "code": "3e.1.16", "name": "Leather Hand Gloves" },
        { "code": "3e.1.17", "name": "Welding Shield/Black Goggles" },
        { "code": "3e.1.18", "name": "Fire Retardant Clothing" },
        { "code": "3e.1.19", "name": "Insulated Gloves" },
        { "code": "3e.1.20", "name": "Arc Flash-rated Suit" },
        { "code": "3e.1.21", "name": "Full Body Safety Harness" },
        { "code": "3e.1.22", "name": "Seat Belt" },
        { "code": "3e.1.23", "name": "Acid-proof Suit" },
        { "code": "3e.1.24", "name": "Air Line Respirator" },
        { "code": "3e.1.25", "name": "SCABA" },
        { "code": "3e.1.26", "name": "Cut Resistance Hand Gloves" },
        { "code": "3e.1.27", "name": "Alusafe Uniform/D3 Protection" }
      ]
    },
    {
      "code": "3e.2",
      "name": "PPE Not Used",
      "items": [
        { "code": "3e.2.1", "name": "Helmet" },
        { "code": "3e.2.2", "name": "Goggles" },
        { "code": "3e.2.3", "name": "Dust mask" },
        { "code": "3e.2.4", "name": "Gas mask" },
        { "code": "3e.2.5", "name": "Ear Plug" },
        { "code": "3e.2.6", "name": "Ear muff" },
        { "code": "3e.2.7", "name": "Hand Gloves" },
        { "code": "3e.2.8", "name": "Coverall" },
        { "code": "3e.2.9", "name": "Chemical Suit" },
        { "code": "3e.2.10", "name": "Leather Apron" },
        { "code": "3e.2.11", "name": "Safety Shoes" },
        { "code": "3e.2.12", "name": "Gum Boot" },
        { "code": "3e.2.13", "name": "Leg Guard" },
        { "code": "3e.2.14", "name": "Balaclava" },
        { "code": "3e.2.15", "name": "Reflective Jacket" },
        { "code": "3e.2.16", "name": "Leather Hand Gloves" },
        { "code": "3e.2.17", "name": "Welding Shield/Black Goggles" },
        { "code": "3e.2.18", "name": "Fire Retardant Clothing" },
        { "code": "3e.2.19", "name": "Insulated Gloves" },
        { "code": "3e.2.20", "name": "Arc Flash-rated Suit" },
        { "code": "3e.2.21", "name": "Full Body Safety Harness" },
        { "code": "3e.2.22", "name": "Seat Belt" },
        { "code": "3e.2.23", "name": "Acid-proof Suit" },
        { "code": "3e.2.24", "name": "Air Line Respirator" },
        { "code": "3e.2.25", "name": "SCABA" },
        { "code": "3e.2.26", "name": "Cut Resistance Hand Gloves" },
        { "code": "3e.2.27", "name": "Alusafe Uniform/D3 Protection" }
      ]
    },
    {
      "code": "3e.3",
      "name": "PPE Not Available",
      "items": [
        { "code": "3e.3.1", "name": "Helmet" },
        { "code": "3e.3.2", "name": "Goggles" },
        { "code": "3e.3.3", "name": "Dust mask" },
        { "code": "3e.3.4", "name": "Gas mask" },
        { "code": "3e.3.5", "name": "Ear Plug" },
        { "code": "3e.3.6", "name": "Ear muff" },
        { "code": "3e.3.7", "name": "Hand Gloves" },
        { "code": "3e.3.8", "name": "Coverall" },
        { "code": "3e.3.9", "name": "Chemical Suit" },
        { "code": "3e.3.10", "name": "Leather Apron" },
        { "code": "3e.3.11", "name": "Safety Shoes" },
        { "code": "3e.3.12", "name": "Gum Boot" },
        { "code": "3e.3.13", "name": "Leg Guard" },
        { "code": "3e.3.14", "name": "Balaclava" },
        { "code": "3e.3.15", "name": "Reflective Jacket" },
        { "code": "3e.3.16", "name": "Leather Hand Gloves" },
        { "code": "3e.3.17", "name": "Welding Shield/Black Goggles" },
        { "code": "3e.3.18", "name": "Fire Retardant Clothing" },
        { "code": "3e.3.19", "name": "Insulated Gloves" },
        { "code": "3e.3.20", "name": "Arc Flash-rated Suit" },
        { "code": "3e.3.21", "name": "Full Body Safety Harness" },
        { "code": "3e.3.22", "name": "Seat Belt" },
        { "code": "3e.3.23", "name": "Acid-proof Suit" },
        { "code": "3e.3.24", "name": "Air Line Respirator" },
        { "code": "3e.3.25", "name": "SCABA" },
        { "code": "3e.3.26", "name": "Cut Resistance Hand Gloves" },
        { "code": "3e.3.27", "name": "Alusafe Uniform/D3 Protection" }
      ]
    },
    {
      "code": "3e.4",
      "name": "PPE Not Suitable as per the Job",
      "items": [
        { "code": "3e.4.1", "name": "Helmet" },
        { "code": "3e.4.2", "name": "Goggles" },
        { "code": "3e.4.3", "name": "Dust mask" },
        { "code": "3e.4.4", "name": "Gas mask" },
        { "code": "3e.4.5", "name": "Ear Plug" },
        { "code": "3e.4.6", "name": "Ear muff" },
        { "code": "3e.4.7", "name": "Hand Gloves" },
        { "code": "3e.4.8", "name": "Coverall" },
        { "code": "3e.4.9", "name": "Chemical Suit" },
        { "code": "3e.4.10", "name": "Leather Apron" },
        { "code": "3e.4.11", "name": "Safety Shoes" },
        { "code": "3e.4.12", "name": "Gum Boot" },
        { "code": "3e.4.13", "name": "Leg Guard" },
        { "code": "3e.4.14", "name": "Balaclava" },
        { "code": "3e.4.15", "name": "Reflective Jacket" },
        { "code": "3e.4.16", "name": "Leather Hand Gloves" },
        { "code": "3e.4.17", "name": "Welding Shield/Black Goggles" },
        { "code": "3e.4.18", "name": "Fire Retardant Clothing" },
        { "code": "3e.4.19", "name": "Insulated Gloves" },
        { "code": "3e.4.20", "name": "Arc Flash-rated Suit" },
        { "code": "3e.4.21", "name": "Full Body Safety Harness" },
        { "code": "3e.4.22", "name": "Seat Belt" },
        { "code": "3e.4.23", "name": "Acid-proof Suit" },
        { "code": "3e.4.24", "name": "Air Line Respirator" },
        { "code": "3e.4.25", "name": "SCABA" },
        { "code": "3e.4.26", "name": "Cut Resistance Hand Gloves" },
        { "code": "3e.4.27", "name": "Alusafe Uniform/D3 Protection" }
      ]
    },
    {
      "code": "3e.5",
      "name": "No Identification Available in PPE",
      "items": [
        { "code": "3e.5.1", "name": "Helmet" },
        { "code": "3e.5.2", "name": "Goggles" },
        { "code": "3e.5.3", "name": "Dust mask" },
        { "code": "3e.5.4", "name": "Gas mask" },
        { "code": "3e.5.5", "name": "Ear Plug" },
        { "code": "3e.5.6", "name": "Ear muff" },
        { "code": "3e.5.7", "name": "Hand Gloves" },
        { "code": "3e.5.8", "name": "Coverall" },
        { "code": "3e.5.9", "name": "Chemical Suit" },
        { "code": "3e.5.10", "name": "Leather Apron" },
        { "code": "3e.5.11", "name": "Safety Shoes" },
        { "code": "3e.5.12", "name": "Gum Boot" },
        { "code": "3e.5.13", "name": "Leg Guard" },
        { "code": "3e.5.14", "name": "Balaclava" },
        { "code": "3e.5.15", "name": "Reflective Jacket" },
        { "code": "3e.5.16", "name": "Leather Hand Gloves" },
        { "code": "3e.5.17", "name": "Welding Shield/Black Goggles" },
        { "code": "3e.5.18", "name": "Fire Retardant Clothing" },
        { "code": "3e.5.19", "name": "Insulated Gloves" },
        { "code": "3e.5.20", "name": "Arc Flash-rated Suit" },
        { "code": "3e.5.21", "name": "Full Body Safety Harness" },
        { "code": "3e.5.22", "name": "Seat Belt" },
        { "code": "3e.5.23", "name": "Acid-proof Suit" },
        { "code": "3e.5.24", "name": "Air Line Respirator" },
        { "code": "3e.5.25", "name": "SCABA" },
        { "code": "3e.5.26", "name": "Cut Resistance Hand Gloves" },
        { "code": "3e.5.27", "name": "Alusafe Uniform/D3 Protection" }
      ]
    },
    {
      "code": "3e.6",
      "name": "PPE Not Tested as per Standard",
      "items": [
        { "code": "3e.6.1", "name": "Helmet" },
        { "code": "3e.6.2", "name": "Goggles" },
        { "code": "3e.6.3", "name": "Dust mask" },
        { "code": "3e.6.4", "name": "Gas mask" },
        { "code": "3e.6.5", "name": "Ear Plug" },
        { "code": "3e.6.6", "name": "Ear muff" },
        { "code": "3e.6.7", "name": "Hand Gloves" },
        { "code": "3e.6.8", "name": "Coverall" },
        { "code": "3e.6.9", "name": "Chemical Suit" },
        { "code": "3e.6.10", "name": "Leather Apron" },
        { "code": "3e.6.11", "name": "Safety Shoes" },
        { "code": "3e.6.12", "name": "Gum Boot" },
        { "code": "3e.6.13", "name": "Leg Guard" },
        { "code": "3e.6.14", "name": "Balaclava" },
        { "code": "3e.6.15", "name": "Reflective Jacket" },
        { "code": "3e.6.16", "name": "Leather Hand Gloves" },
        { "code": "3e.6.17", "name": "Welding Shield/Black Goggles" },
        { "code": "3e.6.18", "name": "Fire Retardant Clothing" },
        { "code": "3e.6.19", "name": "Insulated Gloves" },
        { "code": "3e.6.20", "name": "Arc Flash-rated Suit" },
        { "code": "3e.6.21", "name": "Full Body Safety Harness" },
        { "code": "3e.6.22", "name": "Seat Belt" },
        { "code": "3e.6.23", "name": "Acid-proof Suit" },
        { "code": "3e.6.24", "name": "Air Line Respirator" },
        { "code": "3e.6.25", "name": "SCABA" },
        { "code": "3e.6.26", "name": "Cut Resistance Hand Gloves" },
        { "code": "3e.6.27", "name": "Alusafe Uniform/D3 Protection" }
      ]
    },
    {
      "code": "3e.7",
      "name": "PPE Not Used Correctly",
      "items": [
        { "code": "3e.7.1", "name": "Helmet" },
        { "code": "3e.7.2", "name": "Goggles" },
        { "code": "3e.7.3", "name": "Dust mask" },
        { "code": "3e.7.4", "name": "Gas mask" },
        { "code": "3e.7.5", "name": "Ear Plug" },
        { "code": "3e.7.6", "name": "Ear muff" },
        { "code": "3e.7.7", "name": "Hand Gloves" },
        { "code": "3e.7.8", "name": "Coverall" },
        { "code": "3e.7.9", "name": "Chemical Suit" },
        { "code": "3e.7.10", "name": "Leather Apron" },
        { "code": "3e.7.11", "name": "Safety Shoes" },
        { "code": "3e.7.12", "name": "Gum Boot" },
        { "code": "3e.7.13", "name": "Leg Guard" },
        { "code": "3e.7.14", "name": "Balaclava" },
        { "code": "3e.7.15", "name": "Reflective Jacket" },
        { "code": "3e.7.16", "name": "Leather Hand Gloves" },
        { "code": "3e.7.17", "name": "Welding Shield/Black Goggles" },
        { "code": "3e.7.18", "name": "Fire Retardant Clothing" },
        { "code": "3e.7.19", "name": "Insulated Gloves" },
        { "code": "3e.7.20", "name": "Arc Flash-rated Suit" },
        { "code": "3e.7.21", "name": "Full Body Safety Harness" },
        { "code": "3e.7.22", "name": "Seat Belt" },
        { "code": "3e.7.23", "name": "Acid-proof Suit" },
        { "code": "3e.7.24", "name": "Air Line Respirator" },
        { "code": "3e.7.25", "name": "SCABA" },
        { "code": "3e.7.26", "name": "Cut Resistance Hand Gloves" },
        { "code": "3e.7.27", "name": "Alusafe Uniform/D3 Protection" }
      ]
    }
  ]
},
      {
  "code": "3f",
  "name": "Procedures",
  "subcategories": [
    {
      "code": "3f.1",
      "name": "Chemical Storage & Handling",
      "items": [
        { "code": "3f.1.1", "name": "MSDS is not available" },
        { "code": "3f.1.2", "name": "Not followed standard practice" },
        { "code": "3f.1.3", "name": "Non Availability / Damage of Secondary Containment" },
        { "code": "3f.1.4", "name": "Not Aware on Surroundings" },
        { "code": "3f.1.5", "name": "Non Availability of Signages" },
        { "code": "3f.1.6", "name": "Non Availability of Spill Kits" },
        { "code": "3f.1.12", "name": "Exposure to Chemical/Gas" }
      ]
    },
    {
      "code": "3f.2",
      "name": "Confined Space",
      "items": [
        { "code": "3f.2.1", "name": "<24V DC supply bulb not available/not in use" },
        { "code": "3f.2.2", "name": "IN/OUT entry data not mentioned properly" },
        { "code": "3f.2.3", "name": "Not followed standard practice" },
        { "code": "3f.2.4", "name": "Identification and display of confined Space not available" },
        { "code": "3f.2.5", "name": "Entrant/Attendant unauthorized" },
        { "code": "3f.2.6", "name": "Low illumination" },
        { "code": "3f.2.7", "name": "Attendant was not available" },
        { "code": "3f.2.8", "name": "Provision to alert attendant is not available" },
        { "code": "3f.2.9", "name": "Multi Gas analyser Not available/ Not in Use" },
        { "code": "3f.2.10", "name": "Inadequate Gas Testing" },
        { "code": "3f.2.11", "name": "Inadequate Venting" },
        { "code": "3f.2.12", "name": "Air Quality not within the limit" },
        { "code": "3f.2.14", "name": "Exposure to Pressurized Equipment" },
        { "code": "3f.2.18", "name": "Exposure to Chemical/Gas" }
      ]
    },
    {
      "code": "3f.3",
      "name": "EOT",
      "items": [
        { "code": "3f.3.1", "name": "Breaks not working" },
        { "code": "3f.3.2", "name": "Limit switch not working" },
        { "code": "3f.3.3", "name": "Over loading" },
        { "code": "3f.3.4", "name": "Pendant not having access control" },
        { "code": "3f.3.5", "name": "Testing date not displayed" },
        { "code": "3f.3.6", "name": "SWL not mentioned" },
        { "code": "3f.3.7", "name": "Unauthorised operations" },
        { "code": "3f.3.8", "name": "Inadequate Communication Mechanism" },
        { "code": "3f.3.9", "name": "Audio Alarms not available/Working" },
        { "code": "3f.3.10", "name": "Not followed standard practice" },
        { "code": "3f.3.13", "name": "Carrying out parallel activity" },
        { "code": "3f.3.14", "name": "Caught in/Under between" },
        { "code": "3f.3.15", "name": "Striking against object" },
        { "code": "3f.3.19", "name": "Over head lifting movement" }
      ]
    },
    {
      "code": "3f.4",
      "name": "Excavation",
      "items": [
        { "code": "3f.4.1", "name": "Inadequate barrication" },
        { "code": "3f.4.2", "name": "Excavated material accumulated on aisle" },
        { "code": "3f.4.3", "name": "Excavated Material Not kept at Safe Distance" },
        { "code": "3f.4.4", "name": "Height of Ladder not extended as per standard" },
        { "code": "3f.4.5", "name": "Ladder is not provided at regular interval" },
        { "code": "3f.4.6", "name": "Movement of heavy vehicles near Excavated area." },
        { "code": "3f.4.7", "name": "Shoring or sloping is not provided" },
        { "code": "3f.4.8", "name": "Warning signs including light signal are not provided" },
        { "code": "3f.4.9", "name": "Multi Gas analyser Not available/ Not in Use" },
        { "code": "3f.4.10", "name": "Inadequate Gas Testing" },
        { "code": "3f.4.11", "name": "Air Quality not within the limit" },
        { "code": "3f.4.13", "name": "Exposure to Pressurized Equipment" },
        { "code": "3f.4.14", "name": "Carrying out parallel activity" },
        { "code": "3f.4.15", "name": "Caught in/Under between" },
        { "code": "3f.4.16", "name": "Striking against object" },
        { "code": "3f.4.17", "name": "Exposure to Chemical/Gas" },
        { "code": "3f.4.18", "name": "Exposure to High Voltage / Arc Flash" },
        { "code": "3f.4.19", "name": "Motion of Vehicle or machinery" }
      ]
    },
    {
      "code": "3f.5",
      "name": "Fire Safety",
      "items": [
        { "code": "3f.5.1", "name": "Not following SOP/SMP/JSA" },
        { "code": "3f.5.2", "name": "Auto fire suppression system not working" },
        { "code": "3f.5.3", "name": "Fire alarm not available/not working" },
        { "code": "3f.5.4", "name": "Fire barrier not available in Cable entry point" },
        { "code": "3f.5.5", "name": "Fire hazard due to Dry vegetation" },
        { "code": "3f.5.6", "name": "Required Quantity of Fire Extinguisher is not available" },
        { "code": "3f.5.7", "name": "Hose missing/damaged in hose box" },
        { "code": "3f.5.8", "name": "Hydrant Line not in auto mode" },
        { "code": "3f.5.9", "name": "Required type of Fire Extinguisher is not available" },
        { "code": "3f.5.10", "name": "Transformers are not having Water Sprinkling system" },
        { "code": "3f.5.11", "name": "Fire Extinguisher found damaged/Empty" },
        { "code": "3f.5.12", "name": "Fire Extinguisher inspection due date Expired" },
        { "code": "3f.5.13", "name": "Hydrant Line connecting point blocked" },
        { "code": "3f.5.14", "name": "Fire coding cables in bulk storage areas not available" },
        { "code": "3f.5.15", "name": "Exposure to High Temperature" },
        { "code": "3f.5.16", "name": "Exposure to Pressurized Equipment" },
        { "code": "3f.5.17", "name": "Carrying out parallel activity" },
        { "code": "3f.5.20", "name": "Exposure to Chemical/Gas" },
        { "code": "3f.5.21", "name": "Exposure to High Voltage / Arc Flash" }
      ]
    },
    {
      "code": "3f.6",
      "name": "Emergency Preparedness",
      "items": [
        { "code": "3f.6.1", "name": "Assembly Point blocked/unaccessible" },
        { "code": "3f.6.2", "name": "Combustible material stored in huge quantity" },
        { "code": "3f.6.3", "name": "Emergency Contact Numbers Display missing/incorrect" },
        { "code": "3f.6.4", "name": "Emergency Lighting not available" },
        { "code": "3f.6.5", "name": "Emergency Shower not available/functioning/inaccessible" },
        { "code": "3f.6.6", "name": "Emergency Exit not available" },
        { "code": "3f.6.7", "name": "Emergency Exit blocked" },
        { "code": "3f.6.8", "name": "First Aid Box Damaged" },
        { "code": "3f.6.9", "name": "First Aid Box items expired" },
        { "code": "3f.6.10", "name": "First Aid Box items missing" },
        { "code": "3f.6.11", "name": "Trained First Aider not available in the shift" },
        { "code": "3f.6.12", "name": "Wind Sock Not Available/Damaged" },
        { "code": "3f.6.13", "name": "Exposure to High Temperature" },
        { "code": "3f.6.14", "name": "Exposure to Pressurized Equipment" },
        { "code": "3f.6.15", "name": "Carrying out parallel activity" },
        { "code": "3f.6.18", "name": "Exposure to Chemical/Gas" },
        { "code": "3f.6.19", "name": "Exposure to High Voltage / Arc Flash" },
        { "code": "3f.6.21", "name": "Over head lifting movement" }
      ]
    },
    {
      "code": "3f.7",
      "name": "Electrical Safety",
      "items": [
        { "code": "3f.7.1", "name": "Non Authorised entry marking not available" },
        { "code": "3f.7.2", "name": "Not followed standard practice" },
        { "code": "3f.7.3", "name": "Double Earthing Not available" },
        { "code": "3f.7.4", "name": "Multiple cable joints" },
        { "code": "3f.7.5", "name": "TBT [Test Before Touch] Procedure not followed" },
        { "code": "3f.7.6", "name": "Team was not aware about the Electrical Hazards" },
        { "code": "3f.7.7", "name": "ARC Flash boundary marking not available" },
        { "code": "3f.7.8", "name": "Insulation Mats/Coating not available/damaged" },
        { "code": "3f.7.9", "name": "Access control to unauthorised areas" },
        { "code": "3f.7.10", "name": "Open Panels" },
        { "code": "3f.7.11", "name": "Marking not done" },
        { "code": "3f.7.12", "name": "Updated SLD not available/displayed" },
        { "code": "3f.7.13", "name": "AMBU bag not available/damaged" },
        { "code": "3f.7.14", "name": "Insulation stick not available/damaged" },
        { "code": "3f.7.15", "name": "Lightning arrestors not available/tested" },
        { "code": "3f.7.18", "name": "Carrying out parallel activity" },
        { "code": "3f.7.22", "name": "Exposure to High Voltage / Arc Flash" },
        { "code": "3f.7.24", "name": "Over head lifting movement" }
      ]
    },
    {
      "code": "3f.8",
      "name": "Fall of Ground (Mines)",
      "items": [
        { "code": "3f.8.1", "name": "Area not barricaded" },
        { "code": "3f.8.2", "name": "Area not scaled properly" },
        { "code": "3f.8.3", "name": "Area not supported" },
        { "code": "3f.8.4", "name": "Loose rock fall" },
        { "code": "3f.8.5", "name": "Loose rock present" },
        { "code": "3f.8.6", "name": "Rock mass damage" },
        { "code": "3f.8.7", "name": "Rock noise" },
        { "code": "3f.8.8", "name": "Wire meshing not proper" },
        { "code": "3f.8.9", "name": "Rockfall/Loose present in previously secured area" },
        { "code": "3f.8.10", "name": "Uncontrolled Rockfall during scaling operation" },
        { "code": "3f.8.11", "name": "Rockfall during Support Installation or Rehab works" },
        { "code": "3f.8.12", "name": "Rock Fall inside Stope" },
        { "code": "3f.8.13", "name": "Rockfall during drilling and charging" },
        { "code": "3f.8.14", "name": "Rockfall in shaft/manpass/orepass" },
        { "code": "3f.8.15", "name": "Rock Noise indicating hazardous conditions" },
        { "code": "3f.8.16", "name": "Rehabilitation required" },
        { "code": "3f.8.17", "name": "SSR compliance not done" },
        { "code": "3f.8.21", "name": "Carrying out parallel activity" },
        { "code": "3f.8.22", "name": "Caught in/Under between" },
        { "code": "3f.8.23", "name": "Striking against object" },
        { "code": "3f.8.26", "name": "Motion of Vehicle or machinery" }
      ]
    },
    {
      "code": "3f.9",
      "name": "Explosive Handling and Transportation",
      "items": [
        { "code": "3f.9.1", "name": "Blasting accessories not certified" },
        { "code": "3f.9.2", "name": "Charging face not fenced as per SOP" },
        { "code": "3f.9.3", "name": "Cotton Uniform PPE not worn" },
        { "code": "3f.9.4", "name": "Designated place not marked for loading and unloading at surface." },
        { "code": "3f.9.5", "name": "Detonator box not carrying for detonators" },
        { "code": "3f.9.6", "name": "Earthing chain not available on Explosive carrier/Charmac as per standard" },
        { "code": "3f.9.7", "name": "Explosive brought to face before requirement within shift." },
        { "code": "3f.9.8", "name": "Explosive carrier not locked" },
        { "code": "3f.9.9", "name": "Explosive issued in night hours/odd hours" },
        { "code": "3f.9.10", "name": "Explosive placed at electrical installations" },
        { "code": "3f.9.11", "name": "Explosive vehicle breakdown in public road" },
        { "code": "3f.9.12", "name": "Explosive/detonators theft" },
        { "code": "3f.9.13", "name": "Improper locking arrangements" },
        { "code": "3f.9.14", "name": "Improper position of persons during the charging manually" },
        { "code": "3f.9.15", "name": "Left out explosive not returned to reserve station/Magazine" },
        { "code": "3f.9.16", "name": "Mis handling of explosive boxes/detonators etc" },
        { "code": "3f.9.17", "name": "No guards provided at face" },
        { "code": "3f.9.18", "name": "Not followed Traffic SOP" },
        { "code": "3f.9.19", "name": "Not maintaining stacking height in Reserve station" },
        { "code": "3f.9.20", "name": "Poor housekeeping" },
        { "code": "3f.9.21", "name": "Pricker tools not used for priming" },
        { "code": "3f.9.22", "name": "Primer cartridge was prepared before the requirement" },
        { "code": "3f.9.23", "name": "Random inspection of explosive quantity not checked by foreman" },
        { "code": "3f.9.24", "name": "Reserve Station Issue/Return Register not maintained" },
        { "code": "3f.9.25", "name": "Reserve Station not as per Statutory guidelines" },
        { "code": "3f.9.26", "name": "Safety features missing in explosive van/Utility vehicle" },
        { "code": "3f.9.27", "name": "Separate compartment not provided in reserve station" },
        { "code": "3f.9.28", "name": "Security Person not accompanied with Explosive Van." },
        { "code": "3f.9.29", "name": "Separate compartment not maintained" },
        { "code": "3f.9.30", "name": "Shifted explosive near to drilling machine" },
        { "code": "3f.9.31", "name": "Stacking height marking not provided at Magazine/reserve station" },
        { "code": "3f.9.32", "name": "Stemming pipe/scraper rod not available" },
        { "code": "3f.9.33", "name": "Suitable vehicle not used for transportation of explosive." },
        { "code": "3f.9.34", "name": "Transit slip not carried/not countersigned by FM/Mate/Blaster" },
        { "code": "3f.9.35", "name": "Unauthorised persons" },
        { "code": "3f.9.36", "name": "Unauthorised person entry in Reserve station" },
        { "code": "3f.9.37", "name": "Unauthorised vehicle" },
        { "code": "3f.9.38", "name": "Exposure to High Temperature" },
        { "code": "3f.9.39", "name": "Exposure to Pressurized Equipment" },
        { "code": "3f.9.40", "name": "Carrying out parallel activity" },
        { "code": "3f.9.43", "name": "Exposure to Chemical/Gas" },
        { "code": "3f.9.45", "name": "Motion of Vehicle or machinery" },
        { "code": "3f.9.46", "name": "Over head lifting movement" }
      ]
    },
    {
      "code": "3f.10",
      "name": "Secondary Blasting/Breaking",
      "items": [
        { "code": "3f.10.1", "name": "Blast clearance/Improper communication" },
        { "code": "3f.10.2", "name": "Blasting accessories not certified/not available" },
        { "code": "3f.10.3", "name": "Blasting Cable not laid as per MMR" },
        { "code": "3f.10.4", "name": "Crossing the NO GO Line for operation/Charging/connections" },
        { "code": "3f.10.5", "name": "Exploder key is not in custody of Authorised person" },
        { "code": "3f.10.6", "name": "Failure at designated point pops/plaster of boulders" },
        { "code": "3f.10.7", "name": "Failure of posting blasting guards" },
        { "code": "3f.10.8", "name": "Failure of Re-entry procedure" },
        { "code": "3f.10.9", "name": "Failure of safe distance from blasting/firing point" },
        { "code": "3f.10.10", "name": "Fencing with sign board while charging activity" },
        { "code": "3f.10.11", "name": "Fly rock/hit by other materials" },
        { "code": "3f.10.12", "name": "Improper handling of Explosive/detonators" },
        { "code": "3f.10.13", "name": "Mandatory PPE not used (100% cotton)" },
        { "code": "3f.10.14", "name": "Mechanical Rock breaking-at surface" },
        { "code": "3f.10.15", "name": "Mechanical Rock breaking-in UG" },
        { "code": "3f.10.16", "name": "Misfire handling" },
        { "code": "3f.10.17", "name": "Poor Housekeeping at brow" },
        { "code": "3f.10.18", "name": "Premature blast during the charging/testing with circuit tester" },
        { "code": "3f.10.19", "name": "Primer cartridge was prepared without pricker (Brass/wood/copper alloys)" },
        { "code": "3f.10.20", "name": "Unauthorised Blaster/Mate/Operator" },
        { "code": "3f.10.21", "name": "Without remote operated machine crossed No Go Line" },
        { "code": "3f.10.22", "name": "Working in return air path" },
        { "code": "3f.10.25", "name": "Carrying out parallel activity" },
        { "code": "3f.10.26", "name": "Caught in/Under between" },
        { "code": "3f.10.27", "name": "Striking against object" }
      ]
    },
    {
      "code": "3f.11",
      "name": "Stock Pile",
      "items": [
        { "code": "3f.11.1", "name": "Tension Crack & Ground Movement" },
        { "code": "3f.11.2", "name": "Ensure Proper Drainage System Including Toe-Drain & Garland Drain" },
        { "code": "3f.11.3", "name": "Loaded Truck Found Parked on Slope" },
        { "code": "3f.11.4", "name": "People Doing Job on Top of Stock Pile Not Using PPEs" },
        { "code": "3f.11.5", "name": "Unloading of Material 20m Away from the Crest and Then Spreading Through Dozer" },
        { "code": "3f.11.8", "name": "Carrying Out Parallel Activity" },
        { "code": "3f.11.9", "name": "Caught In/Under Between" },
        { "code": "3f.11.10", "name": "Striking Against Object" },
        { "code": "3f.11.13", "name": "Motion of Vehicle or Machinery" }
      ]
    },
    {
      "code": "3f.12",
      "name": "Rail Safety",
      "items": [
        { "code": "3f.12.1", "name": "Boarding/Deboarding LOCO in Running Condition" },
        { "code": "3f.12.2", "name": "Improper Signaling" },
        { "code": "3f.12.3", "name": "LC Gate Related" },
        { "code": "3f.12.4", "name": "Railway Track Related" },
        { "code": "3f.12.5", "name": "Shunting/Coupling/De-coupling" },
        { "code": "3f.12.6", "name": "Speed Limit Exceeded" },
        { "code": "3f.12.7", "name": "Track Maintenance" },
        { "code": "3f.12.8", "name": "Wheel Stopper Not Applied" },
        { "code": "3f.12.9", "name": "Vegetation Developed" },
        { "code": "3f.12.10", "name": "Inadequate Warning/Signage" },
        { "code": "3f.12.13", "name": "Carrying Out Parallel Activity" },
        { "code": "3f.12.14", "name": "Caught In/Under Between" },
        { "code": "3f.12.15", "name": "Striking Against Object" },
        { "code": "3f.12.17", "name": "Exposure to High Voltage / Arc Flash" },
        { "code": "3f.12.18", "name": "Motion of Vehicle or Machinery" }
      ]
    },
    {
      "code": "3f.13",
      "name": "Industrial Hygiene",
      "items": [
        { "code": "3f.13.1", "name": "Exposure to Dust" },
        { "code": "3f.13.2", "name": "Exposure to Heat" },
        { "code": "3f.13.3", "name": "Exposure to Chemical" },
        { "code": "3f.13.4", "name": "Exposure to Noise" },
        { "code": "3f.13.5", "name": "Exposure to Biological" },
        { "code": "3f.13.6", "name": "Ventilation" },
        { "code": "3f.13.7", "name": "Illumination" },
        { "code": "3f.13.8", "name": "Exposure to Fumes/Harmful Gases" },
        { "code": "3f.13.9", "name": "Humidity Issues" },
        { "code": "3f.13.10", "name": "Glares" },
        { "code": "3f.13.11", "name": "Exposure to Radiation" },
        { "code": "3f.13.12", "name": "Exposure to Cold" },
        { "code": "3f.13.13", "name": "Vibration" }
      ]
    },
    {
      "code": "3f.14",
      "name": "Lifting & Shifting of Equipment & Material",
      "items": [
        { "code": "3f.14.1", "name": "Capacity of Lifting Tools and Tackles Are Not Adequate for Lifting" },
        { "code": "3f.14.2", "name": "Classification of Lift Not Done in Lift Plan" },
        { "code": "3f.14.3", "name": "Crane Inspection and Load Test Not Done" },
        { "code": "3f.14.4", "name": "Crane Is Not Leveled on Ground and Outriggers Are Not Locked" },
        { "code": "3f.14.5", "name": "Crane Maintenance Plan/Schedule Not Adhered" },
        { "code": "3f.14.6", "name": "Dry Run Not Carried Out" },
        { "code": "3f.14.7", "name": "Functional Checks of Crane Not Carried Out and Documented Prior to Lift" },
        { "code": "3f.14.8", "name": "Ground Condition of Crane Not Adequate" },
        { "code": "3f.14.9", "name": "Lift Plan Is Not Approved by Authorized Lift Plan Approver" },
        { "code": "3f.14.10", "name": "Lift Plan Not Available" },
        { "code": "3f.14.11", "name": "Lifted Load Is Left Unattended" },
        { "code": "3f.14.12", "name": "Lifting Done in Unfavorable Weather, Like High Wind or Rain" },
        { "code": "3f.14.13", "name": "Lifting History Not Maintained by Crane Operator" },
        { "code": "3f.14.14", "name": "Lifting Tools and Tackle Are Not Color Coded" },
        { "code": "3f.14.15", "name": "Lifting Tools and Tackle Are Not Protected by Sharp Edges" },
        { "code": "3f.14.16", "name": "Lifting Tools and Tackle Are Not Tested/Have Valid Certificate" },
        { "code": "3f.14.17", "name": "Lifting Tools and Tackle Having Physical Damage" },
        { "code": "3f.14.18", "name": "Means of Communication Not Established Between Crane Operator and Signal Man" },
        { "code": "3f.14.19", "name": "Mobile Crane Is Marching with Load Suspended" },
        { "code": "3f.14.20", "name": "Material Shifted Through Hydra/Crane Is More Than Critical Lift" },
        { "code": "3f.14.21", "name": "Material Shifted Through Hydra/Crane Without Guide Rope" },
        { "code": "3f.14.22", "name": "Signal Man and Rigging Crew Not Aware About Right Hand Signal" },
        { "code": "3f.14.23", "name": "Signal Man Is Not Wearing High Visibility Vest" },
        { "code": "3f.14.24", "name": "Swing Radius of Crane Is Not Barricaded" },
        { "code": "3f.14.25", "name": "Trained and Certified Rigger/Signal Man Not Available" },
        { "code": "3f.14.26", "name": "Trained Operator Not Available on Crane" },
        { "code": "3f.14.27", "name": "UT/MPT/NDT of Crane Pressure Bearing Like Hook, Pins, etc. Not Done or Expired" },
        { "code": "3f.14.28", "name": "Oil Leakage in Crane from Lifting Attachment" },
        { "code": "3f.14.29", "name": "Outriggers Are Not Taken Out Completely" },
        { "code": "3f.14.30", "name": "Hydra/Crane Driver Was Not Having Knowledge About Lifting Standard" },
        { "code": "3f.14.31", "name": "OEM Lifting Chart Is Not Available" },
        { "code": "3f.14.32", "name": "Sensors/Load Cell Is Not Having Valid Calibration" },
        { "code": "3f.14.33", "name": "Improperly Prepared Lifting Tools" },
        { "code": "3f.14.34", "name": "Usage of Mobile Phones" },
        { "code": "3f.14.37", "name": "Carrying Out Parallel Activity" },
        { "code": "3f.14.38", "name": "Caught In/Under Between" },
        { "code": "3f.14.39", "name": "Striking Against Object" },
        { "code": "3f.14.41", "name": "Exposure to High Voltage / Arc Flash" },
        { "code": "3f.14.42", "name": "Motion of Vehicle or Machinery" },
        { "code": "3f.14.43", "name": "Overhead Lifting Movement" }
      ]
    },
    {
      "code": "3f.15",
      "name": "Machine Guarding & Conveyor Safety",
      "items": [
        { "code": "3f.15.1", "name": "Maintenance Done Inside Plant Premises by Unauthorized Technician" },
        { "code": "3f.15.2", "name": "Existing Guard Removed & Machine Is Running" },
        { "code": "3f.15.3", "name": "Guard Gap Present Having Access to Moving Parts" },
        { "code": "3f.15.4", "name": "Machine Guard Removal Protection/Interlock Is Available but Not Operational" },
        { "code": "3f.15.5", "name": "Machine Guard Removal Protection/Interlock Is Not Available" },
        { "code": "3f.15.6", "name": "Emergency Stop Is Damaged/Not Functional" },
        { "code": "3f.15.7", "name": "Emergency Stop Is Inaccessible" },
        { "code": "3f.15.8", "name": "Machine Guard Is Rusted/Damaged" },
        { "code": "3f.15.9", "name": "Nut-Bolt Is Missing/Loose" },
        { "code": "3f.15.10", "name": "Material Accumulation in Conveyor Region" },
        { "code": "3f.15.11", "name": "Return Roller Guard Missing Under Which Movement Is Not Restricted" },
        { "code": "3f.15.12", "name": "Standard Guard Is Not Present" },
        { "code": "3f.15.13", "name": "Person Found Poking During Running Conveyor" },
        { "code": "3f.15.14", "name": "Person Working Near Machine with Loose Clothing" },
        { "code": "3f.15.15", "name": "Conveyor Started Without Siren (Audio/Visual)" },
        { "code": "3f.15.16", "name": "Person Working on Guard Removal Job Is Not Authorized" },
        { "code": "3f.15.17", "name": "MG Drawing Not Authorized" },
        { "code": "3f.15.18", "name": "MG Not Color Coded as per Standard" },
        { "code": "3f.15.21", "name": "Carrying Out Parallel Activity" },
        { "code": "3f.15.22", "name": "Caught In/Under Between" },
        { "code": "3f.15.23", "name": "Striking Against Object" }
      ]
    },
    {
      "code": "3f.16",
      "name": "Molten Metal / Hot Metal Handling",
      "items": [
        { "code": "3f.16.1", "name": "Pre-Heating Not Done" },
        { "code": "3f.16.2", "name": "Wet Surfaces Around Hot Metal Area" },
        { "code": "3f.16.3", "name": "Hot Metal Equipment/Tools Not Maintained in Dry Condition" },
        { "code": "3f.16.4", "name": "Unauthorized Person in Hot Metal Area" },
        { "code": "3f.16.5", "name": "HM Handling Equipment Fail Safe Device/Interlocks - Not Having/Not Working" },
        { "code": "3f.16.6", "name": "Hard Barricading Not Available" },
        { "code": "3f.16.7", "name": "Access Control Not Available" },
        { "code": "3f.16.8", "name": "Emergency Lights Not Available" },
        { "code": "3f.16.9", "name": "Power Backup Not Available" },
        { "code": "3f.16.10", "name": "Warning Device (Bell, Horn, Siren, or Flash Light) Not Available During Metal Movement" },
        { "code": "3f.16.11", "name": "Limit Switch & Mechanical Stopper Not Present on Laddle Transfer Car Track" },
        { "code": "3f.16.12", "name": "Laddle Transfer Track Unguarded" },
        { "code": "3f.16.13", "name": "Roof Sheeting Damaged" },
        { "code": "3f.16.14", "name": "Dyke/Pit Not Available/Damaged for Secondary Containment" },
        { "code": "3f.16.15", "name": "Water Logging Condition in Hot Zone Area" },
        { "code": "3f.16.16", "name": "Safety Devices Related to Furnace Not Healthy/Working" },
        { "code": "3f.16.17", "name": "Heat Shield Protection Glass on Forklift Not Available" },
        { "code": "3f.16.18", "name": "Eye Shower Not Available/Not Working" },
        { "code": "3f.16.19", "name": "Dedicated Safe Movement/Route Not Defined" },
        { "code": "3f.16.21", "name": "Exposure to High Temperature" },
        { "code": "3f.16.22", "name": "Exposure to Pressurized Equipment" },
        { "code": "3f.16.23", "name": "Carrying Out Parallel Activity" },
        { "code": "3f.16.24", "name": "Caught In/Under Between" },
        { "code": "3f.16.26", "name": "Exposure to Chemical/Gas" },
        { "code": "3f.16.28", "name": "Motion of Vehicle or Machinery" },
        { "code": "3f.16.29", "name": "Overhead Lifting Movement" }
      ]
    },
    {
      "code": "3f.17",
      "name": "LOTO (Lockout/Tagout)",
      "items": [
        { "code": "3f.17.1", "name": "Isolation Done but Tag Not Provided" },
        { "code": "3f.17.2", "name": "All Required Energy Sources Not Identified" },
        { "code": "3f.17.3", "name": "Mechanical Isolation Not Done" },
        { "code": "3f.17.4", "name": "LOTO Instructions Not Followed" },
        { "code": "3f.17.5", "name": "Process Isolation Not Done" },
        { "code": "3f.17.6", "name": "Electrical Isolation Not Done" },
        { "code": "3f.17.7", "name": "LOTO Register Not Maintained" },
        { "code": "3f.17.8", "name": "SLB Not Having Key Inside It and Job Is In Progress" },
        { "code": "3f.17.9", "name": "Zero Energy Status Not Ensured Before Work" },
        { "code": "3f.17.10", "name": "Area Incharge Not Informed Before Taking LOTO" },
        { "code": "3f.17.11", "name": "Isolation Done by Unauthorized Person" },
        { "code": "3f.17.12", "name": "Wrong Type of Lock Applied" },
        { "code": "3f.17.13", "name": "Personal Locks Not Applied by All Working Crew" },
        { "code": "3f.17.14", "name": "Wrong Equipment Isolated" },
        { "code": "3f.17.15", "name": "Exposure to High Temperature" },
        { "code": "3f.17.16", "name": "Exposure to Pressurized Equipment" },
        { "code": "3f.17.17", "name": "Carrying Out Parallel Activity" },
        { "code": "3f.17.18", "name": "Caught In/Under Between" },
        { "code": "3f.17.20", "name": "Exposure to Chemical/Gas" },
        { "code": "3f.17.21", "name": "Exposure to High Voltage / Arc Flash" },
        { "code": "3f.17.22", "name": "Motion of Vehicle or Machinery" }
      ]
    },
    {
      "code": "3f.18",
      "name": "Hot Work",
      "items": [
        { "code": "3f.18.1", "name": "Area Barricading Not Done" },
        { "code": "3f.18.2", "name": "Authorized Welder Not Doing Job" },
        { "code": "3f.18.3", "name": "Fire Extinguisher or Water Hose Not Available" },
        { "code": "3f.18.4", "name": "Fire Watcher Not Available at Site for Critical Flammable Area" },
        { "code": "3f.18.5", "name": "Gas Cutting Set Depressurized Not Done After Use" },
        { "code": "3f.18.6", "name": "Area Not Cleared Before the Hot Work" },
        { "code": "3f.18.7", "name": "Welding Is Done in Wet Area" },
        { "code": "3f.18.8", "name": "Pre-operation Checklist Not Filled for Gas Cutting Set/Welding Set" },
        { "code": "3f.18.9", "name": "Pressure Gauge Damaged in Gas Cylinders" },
        { "code": "3f.18.10", "name": "Welding Hose, NRV, Flash Back Arrester Not Operative/Damaged" },
        { "code": "3f.18.11", "name": "Welding Machine/Grinding Machine Certification Overdue" },
        { "code": "3f.18.12", "name": "Fire Blanket/Mat/Tray Not Provided" },
        { "code": "3f.18.13", "name": "Earthing Not Provided" },
        { "code": "3f.18.14", "name": "Color Coding of Gas Cylinder Not Appropriate" },
        { "code": "3f.18.15", "name": "Labeling and Warning Signage Not Available on Gas Cylinder" },
        { "code": "3f.18.16", "name": "Valve Damaged" },
        { "code": "3f.18.17", "name": "Cutting Hose Not ISI Marked" },
        { "code": "3f.18.18", "name": "Gas Cylinder Found Lying on Ground" },
        { "code": "3f.18.19", "name": "Gas Cylinder Not Secured" },
        { "code": "3f.18.20", "name": "Valve Fittings Not Matching" },
        { "code": "3f.18.21", "name": "Grease/Oil Found on Valve" },
        { "code": "3f.18.22", "name": "Soap Solution Not Available" },
        { "code": "3f.18.23", "name": "Trolley for Transporting Cylinders Was Damaged" },
        { "code": "3f.18.24", "name": "Holder Insulation Damaged" },
        { "code": "3f.18.25", "name": "Safe Distance Between Cylinders Not Maintained" },
        { "code": "3f.18.26", "name": "Cylinders Not Segregated Properly" },
        { "code": "3f.18.27", "name": "VRD Not Available" },
        { "code": "3f.18.28", "name": "Exposure to High Temperature" },
        { "code": "3f.18.30", "name": "Carrying Out Parallel Activity" },
        { "code": "3f.18.33", "name": "Exposure to Chemical/Gas" }
      ]
    },
    {
      "code": "3f.19",
      "name": "Vehicle & Driving",
      "items": [
        { "code": "3f.19.1", "name": "Driver Is Fatigued/Working Without Taking Rest" },
        { "code": "3f.19.2", "name": "Driver/Operator Is Unfit/Under Medication/Medical Fitness Lapsed/Not Authorized" },
        { "code": "3f.19.3", "name": "Driver Does Not Have Valid License" },
        { "code": "3f.19.4", "name": "Pre-Operation Safety Checklist Is Not Filled/Invalid" },
        { "code": "3f.19.5", "name": "Driver Under Influence of Drugs/Alcohol" },
        { "code": "3f.19.6", "name": "Vehicle Is Not Fitted with Seat Belt" },
        { "code": "3f.19.7", "name": "Driver/Passengers Not Wearing Seat Belts" },
        { "code": "3f.19.8", "name": "Deviated from Journey Risk Management/Assessment" },
        { "code": "3f.19.9", "name": "Overspeeding" },
        { "code": "3f.19.10", "name": "Overtaking Protocols Violated" },
        { "code": "3f.19.11", "name": "Vehicle Moved in Hazardous/Restricted Area" },
        { "code": "3f.19.12", "name": "Minimum Safe Distance Between Vehicles Not Maintained" },
        { "code": "3f.19.13", "name": "Wheel Stopper/Chocks Not Applied" },
        { "code": "3f.19.14", "name": "Vehicle Does Not Have Mandatory Emergency Response Items e.g., Roadside Triangle, Fire Extinguisher, etc." },
        { "code": "3f.19.15", "name": "Reverse Alarm Is Not Functional/Available" },
        { "code": "3f.19.16", "name": "Side Seating Policy Violation" },
        { "code": "3f.19.17", "name": "Preventive Maintenance & Inspection Not Carried Out" },
        { "code": "3f.19.18", "name": "TREM Card Is Not Available for Hazardous Chemical/Waste Transport Vehicle" },
        { "code": "3f.19.19", "name": "Statutory Documents for Vehicle Operation Is Missing/Invalid" },
        { "code": "3f.19.20", "name": "Driver Using Mobile Phone While Driving" },
        { "code": "3f.19.21", "name": "Driver Violated Traffic Signal/Traffic Marshal's Direction" },
        { "code": "3f.19.22", "name": "Driver Violated Site Reversing Policy" },
        { "code": "3f.19.23", "name": "Vehicle Fitness No-Go Criteria Is Not Fulfilled" },
        { "code": "3f.19.24", "name": "Overloading/Overcrowding of the Vehicle" },
        { "code": "3f.19.25", "name": "Driving with Lifted Body" },
        { "code": "3f.19.26", "name": "Vehicle Body Damaged/Parts Not Working" },
        { "code": "3f.19.28", "name": "Main Horn Working" },
        { "code": "3f.19.29", "name": "Side Indicators Not Working" },
        { "code": "3f.19.30", "name": "Head Light Not Working" },
        { "code": "3f.19.31", "name": "Rear View Mirror Not Available" },
        { "code": "3f.19.33", "name": "Reflective Tape Not Available" },
        { "code": "3f.19.34", "name": "RUPD/SUPD Not Available" },
        { "code": "3f.19.36", "name": "Fire Extinguisher Not Available" },
        { "code": "3f.19.37", "name": "Fire Extinguisher Depressurized" },
        { "code": "3f.19.38", "name": "Fire Extinguisher Not Inspected" },
        { "code": "3f.19.39", "name": "First Aid Box Not Available" },
        { "code": "3f.19.41", "name": "Medicines of First Aid Expired" },
        { "code": "3f.19.42", "name": "First Aid Box Register Not Available" },
        { "code": "3f.19.43", "name": "Driver Rest Shed Not Available" },
        { "code": "3f.19.44", "name": "Pedestrian Walkway Not Available" },
        { "code": "3f.19.45", "name": "Parking Place Not Available" },
        { "code": "3f.19.46", "name": "Convex Mirror Not Available at Blind Spots" },
        { "code": "3f.19.47", "name": "Vehicle Not Followed the Defined Route" },
        { "code": "3f.19.48", "name": "Fatigue Register/Diary/JMP Not Available" },
        { "code": "3f.19.49", "name": "Fatigue Register Is Not Updated" },
        { "code": "3f.19.51", "name": "EIP Not Correct" },
        { "code": "3f.19.52", "name": "EIP Not Available" },
        { "code": "3f.19.54", "name": "Driver Found Sitting/Sleeping Under Vehicle" },
        { "code": "3f.19.55", "name": "Driver Found Cooking Inside Plant" },
        { "code": "3f.19.56", "name": "Driver Found Doing Maintenance of Vehicle" },
        { "code": "3f.19.57", "name": "Tagging Not Done" },
        { "code": "3f.19.65", "name": "Motion of Vehicle or Machinery" }
      ]
    },
    {
      "code": "3f.20",
      "name": "Scaffolding System",
      "items": [
        { "code": "3f.20.1", "name": "Authorized Scaffolding Inspector Has Not Certified the Scaffold" },
        { "code": "3f.20.2", "name": "Landing Platform Not Available" },
        { "code": "3f.20.3", "name": "Standard Ladder Not Available/Not Used" },
        { "code": "3f.20.4", "name": "Team Working Without Usage of Life Line" },
        { "code": "3f.20.5", "name": "Base Plate/Sole Plate Not Provided/Not Meeting Standard" },
        { "code": "3f.20.6", "name": "Scaffolding Pipes Not Provided/Not Meeting Standard" },
        { "code": "3f.20.7", "name": "Scaffolding Material Not Color Coded" },
        { "code": "3f.20.8", "name": "Scaffolding Plank Not Provided/Not Meeting Standard" },
        { "code": "3f.20.9", "name": "Scaffolding Clamps Not Provided/Not Meeting Standard" },
        { "code": "3f.20.10", "name": "Scaffolding Not in Plumb and Level" },
        { "code": "3f.20.11", "name": "Landing Platforms Not Provided" },
        { "code": "3f.20.12", "name": "Barricading Not Done" },
        { "code": "3f.20.13", "name": "Scaffolders Are Not Trained/Certified" },
        { "code": "3f.20.14", "name": "Guard Rails Not Provided - Mid Rail, Top Rail, and Toe Guard" },
        { "code": "3f.20.15", "name": "Scaffolding Material Not Tested and Certified" },
        { "code": "3f.20.16", "name": "Green Tag Not Available but Job Is Ongoing" },
        { "code": "3f.20.17", "name": "Person Working on Expired Green Tag" },
        { "code": "3f.20.18", "name": "Red Tag Is Not Available on Scaffolding" },
        { "code": "3f.20.19", "name": "Cautionary Barricade Used in Place of Hard Barricading" },
        { "code": "3f.20.20", "name": "People Working Below the Area Barricaded" },
        { "code": "3f.20.21", "name": "Rubber Bush Not Available/Damaged" },
        { "code": "3f.20.22", "name": "Portable Ladder 4:1 Ratio Not Maintained" },
        { "code": "3f.20.23", "name": "Scaffolder Certificate Validity Expired" },
        { "code": "3f.20.24", "name": "Scaffolding Erected in Area Where Water Is Filled" },
        { "code": "3f.20.25", "name": "Work Platform Overloaded with Excess Material" },
        { "code": "3f.20.26", "name": "Gap Between Planks" },
        { "code": "3f.20.27", "name": "Safety Net Not Used" },
        { "code": "3f.20.28", "name": "Lock Pin of Mobile Scaffold Damaged" },
        { "code": "3f.20.29", "name": "Scaffolding Tying Not Done" },
        { "code": "3f.20.30", "name": "Material Put at the Edge of Scaffold" },
        { "code": "3f.20.31", "name": "Bracing Used for Climbing on Scaffolding" },
        { "code": "3f.20.34", "name": "Carrying Out Parallel Activity" },
        { "code": "3f.20.35", "name": "Caught In/Under Between" },
        { "code": "3f.20.36", "name": "Striking Against Object" },
        { "code": "3f.20.38", "name": "Exposure to High Voltage / Arc Flash" },
        { "code": "3f.20.39", "name": "Motion of Vehicle or Machinery" },
        { "code": "3f.20.40", "name": "Overhead Lifting Movement" },
        { "code": "3f.20.41", "name": "Misuse of Scaffolding Material" }
      ]
    },
{
  "code": "3f.21",
  "name": "Work at Height",
  "items": [
    { "code": "3f.21.1", "name": "Area Below Work Not Barricaded" },
    { "code": "3f.21.2", "name": "Hand Railing Is Missing" },
    { "code": "3f.21.3", "name": "Platform Not Available" },
    { "code": "3f.21.4", "name": "Safety Harness Not Anchored at Right Place" },
    { "code": "3f.21.5", "name": "Safety Net Missing" },
    { "code": "3f.21.6", "name": "Team Working Without Usage of Life Line" },
    { "code": "3f.21.7", "name": "Toe Guard Missing" },
    { "code": "3f.21.8", "name": "Working During Extreme Climate Conditions" },
    { "code": "3f.21.9", "name": "Height Pass/Height Phobia Test Not Available/Expired" },
    { "code": "3f.21.10", "name": "Substandard Work at Height Equipment/Arrangement" },
    { "code": "3f.21.11", "name": "PFD Not Provided/Damaged Near Drowning Hazard" },
    { "code": "3f.21.12", "name": "Depth Marking Not Provided Near Drowning Hazard" },
    { "code": "3f.21.13", "name": "Warning Signages Not Provided" },
    { "code": "3f.21.14", "name": "3-Point Contact Not Maintained" },
    { "code": "3f.21.15", "name": "Work at Height Equipment/Structure Not Identified" },
    { "code": "3f.21.16", "name": "Internal Inspection of Work at Height Item Not Done/Expired" },
    { "code": "3f.21.17", "name": "External Certification of Work at Height Item Not Done/Expired" },
    { "code": "3f.21.18", "name": "Damaged Fall Protection/Restraint Equipment" },
    { "code": "3f.21.19", "name": "Parapet Wall Not Available/Not Meeting Standard" },
    { "code": "3f.21.20", "name": "Access Control Not Provided" },
    { "code": "3f.21.21", "name": "Grab Fall Arrestor Not Provided While Using Vertical Lifeline" },
    { "code": "3f.21.22", "name": "Tools Are Not Secured While Working at Height" },
    { "code": "3f.21.23", "name": "Roof Walk Ladder Not Present for Fragile Roof" },
    { "code": "3f.21.24", "name": "Suitable Anchor Point Not Provided for Roof Walk" },
    { "code": "3f.21.25", "name": "Poor/Weak Anchor Point Found" },
    { "code": "3f.21.26", "name": "Manila Rope Less Than 19mm Being Used" },
    { "code": "3f.21.27", "name": "MS Wire Rope Less Than 12mm Being Used" },
    { "code": "3f.21.28", "name": "SS Wire Rope Less Than 8mm Being Used" },
    { "code": "3f.21.29", "name": "Damaged Lifeline/Lifeline Not Tested" },
    { "code": "3f.21.30", "name": "Slag in Lifeline and Lifeline Not Taut" },
    { "code": "3f.21.31", "name": "Anchor Point Not Tested" },
    { "code": "3f.21.32", "name": "Sufficient Anchor Point Not Available" },
    { "code": "3f.21.33", "name": "Cautionary Barricade Used in Place of Hard Barricading" },
    { "code": "3f.21.34", "name": "People Working/Passing Through the Barricaded Area" },
    { "code": "3f.21.35", "name": "EWP Not Inspected/Certified" },
    { "code": "3f.21.36", "name": "EWP Not on Level Surface" },
    { "code": "3f.21.37", "name": "Excess People Working on the EWP" },
    { "code": "3f.21.38", "name": "Person Anchoring the Safety Harness in the Railing of the EWP Cage Rather Than Anchoring on the Specified Point" },
    { "code": "3f.21.39", "name": "Person Standing on the Top of the Railing of the EWP" },
    { "code": "3f.21.40", "name": "EWP Positioned Below HT Line/Fuel Line/Stream Line" },
    { "code": "3f.21.41", "name": "Safety Net Test Certificate Not Available" },
    { "code": "3f.21.42", "name": "Safety Net Erected Greater Than 6m Below the Job" },
    { "code": "3f.21.43", "name": "Safety Net Found in Damaged Condition" },
    { "code": "3f.21.44", "name": "Safety Net Not Covering the Complete Working Area" },
    { "code": "3f.21.45", "name": "Gap Found Between Two Safety Nets Attached" },
    { "code": "3f.21.46", "name": "Using Makeshift Platform (Barrel/Pipeline)" },
    { "code": "3f.21.47", "name": "Ladder Damaged" },
    { "code": "3f.21.48", "name": "Handrail Not Used While Ascending and Descending Staircase" },
    { "code": "3f.21.49", "name": "Ladder Not Secured by Tying" },
    { "code": "3f.21.50", "name": "Ladder Placed Is Not 1 Meter Above from Top Ground" },
    { "code": "3f.21.53", "name": "Carrying Out Parallel Activity" },
    { "code": "3f.21.54", "name": "Caught In/Under Between" },
    { "code": "3f.21.55", "name": "Striking Against Object" },
    { "code": "3f.21.57", "name": "Exposure to High Voltage / Arc Flash" },
    { "code": "3f.21.58", "name": "Motion of Vehicle or Machinery" },
    { "code": "3f.21.59", "name": "Overhead Lifting Movement" }
  ]
},
{
  "code": "3f.22",
  "name": "Permit to Work",
  "items": [
    { "code": "3f.22.1", "name": "Non-Availability/Display of Permit at Site" },
    { "code": "3f.22.2", "name": "Inadequate Filling of Permits" },
    { "code": "3f.22.3", "name": "Inadequate Job Description in Permit" },
    { "code": "3f.22.4", "name": "Issuer/Receiver/Custodian Not Authorized" },
    { "code": "3f.22.5", "name": "Inadequate Hazards Identification in Permits" },
    { "code": "3f.22.6", "name": "Inadequate Controls Identification in Permits" },
    { "code": "3f.22.7", "name": "Inadequate/Non-Availability of JSA" },
    { "code": "3f.22.8", "name": "Permit Not Extended as per Standard Requirement/Used Beyond Validity" },
    { "code": "3f.22.9", "name": "Inadequate Availability/Filling of Special Permits/Annexure/Certificates" },
    { "code": "3f.22.10", "name": "Inadequate Filling of All Copies of Permits" },
    { "code": "3f.22.11", "name": "Permit Register Is Not Maintained" },
    { "code": "3f.22.12", "name": "Gas Testing Readings Not Mentioned in Permit" },
    { "code": "3f.22.13", "name": "TBT/PAP Talks Not Mentioned" },
    { "code": "3f.22.14", "name": "LOTO Details Not Mentioned Properly" },
    { "code": "3f.22.15", "name": "Rescue Plan for Work at Height Not Available" },
    { "code": "3f.22.16", "name": "Rescue Plan for Confined Space Not Available" },
    { "code": "3f.22.17", "name": "AVI/Online Permits Not Taken/Not Proper" },
    { "code": "3f.22.18", "name": "Sign Off Not Proper" },
    { "code": "3f.22.19", "name": "Job Completed, but Permit Not Closed" },
    { "code": "3f.22.20", "name": "JSA Not Specific for Job" }
  ]
},
{
  "code": "3f.23",
  "name": "Material Handling",
  "items": [
    { "code": "3f.23.1", "name": "Improper Crossing/Movement" },
    { "code": "3f.23.2", "name": "Material Not Tied Properly" },
    { "code": "3f.23.3", "name": "Material Protruding Out from Vehicle" },
    { "code": "3f.23.4", "name": "Material Segregation Not Done" },
    { "code": "3f.23.5", "name": "Pipes Handled > 300mm Dia, Choker Block or Dunnage Was Not Used" },
    { "code": "3f.23.6", "name": "Nails Were Not Removed from the Wooden Scrap Handled" },
    { "code": "3f.23.7", "name": "Enclosed Passage/Machinery Was Not Used for Solvent Waste" },
    { "code": "3f.23.8", "name": "Material Was Not Packed" },
    { "code": "3f.23.9", "name": "Material Not Stored in Proper Area" },
    { "code": "3f.23.10", "name": "Material Stored Was Overloaded" },
    { "code": "3f.23.11", "name": "Rigid Frame Was Not Used Under the Rolling Objects" },
    { "code": "3f.23.12", "name": "Stairs Were Not Provided for Climbing on Spares >6ft. for Mounting Slings" },
    { "code": "3f.23.13", "name": "Checklist of Material Storage Not Available" },
    { "code": "3f.23.14", "name": "Checklist of Material Storage Incompletely Filled" },
    { "code": "3f.23.15", "name": "Material Not Secured" },
    { "code": "3f.23.16", "name": "Material Oversize" },
    { "code": "3f.23.17", "name": "Guide Rope Not Used" },
    { "code": "3f.23.18", "name": "Drum Stacker Not Available" },
    { "code": "3f.23.19", "name": "Oil Drum Not Stored with Spill Control Pallet" },
    { "code": "3f.23.20", "name": "Trolley for Transporting Oil Drums Was Damaged" },
    { "code": "3f.23.21", "name": "Side Pulling Done" },
    { "code": "3f.23.22", "name": "Knot Not Properly Used" },
    { "code": "3f.23.23", "name": "Display of Signages Not Done" },
    { "code": "3f.23.24", "name": "Exposure to High Temperature" },
    { "code": "3f.23.25", "name": "Exposure to Pressurized Equipment" },
    { "code": "3f.23.26", "name": "Carrying Out Parallel Activity" },
    { "code": "3f.23.27", "name": "Caught In/Under Between" },
    { "code": "3f.23.28", "name": "Striking Against Object" },
    { "code": "3f.23.29", "name": "Exposure to Chemical/Gas" },
    { "code": "3f.23.30", "name": "Exposure to High Voltage / Arc Flash" },
    { "code": "3f.23.31", "name": "Motion of Vehicle or Machinery" },
    { "code": "3f.23.32", "name": "Overhead Lifting Movement" }
  ]
},
{
  "code": "3f.24",
  "name": "Lift Standard",
  "items": [
    { "code": "3f.24.1", "name": "Lift Owner Is Not Defined" },
    { "code": "3f.24.2", "name": "Lift Owner Is Not Trained/Authorized" },
    { "code": "3f.24.3", "name": "Inspection/Maintenance Records of Lift Not Available" },
    { "code": "3f.24.4", "name": "Intercom Facility Not Available" },
    { "code": "3f.24.5", "name": "Emergency Contact Numbers Not Available" },
    { "code": "3f.24.6", "name": "Location of Key Not Mentioned at the Door" },
    { "code": "3f.24.7", "name": "Next Periodic Maintenance Due Date Expired" },
    { "code": "3f.24.8", "name": "Next Periodic Maintenance Due Date Not Available" },
    { "code": "3f.24.9", "name": "Battery Operated Automatic Rescue Device Not Available/Working" },
    { "code": "3f.24.10", "name": "Emergency Light Not Available" },
    { "code": "3f.24.11", "name": "Fire Resistant Enclosures/Doors Not Available" },
    { "code": "3f.24.12", "name": "Car Top/Car Side Emergency Exit Not Available" },
    { "code": "3f.24.13", "name": "Penthouse/Machine Room Doors Not Locked" },
    { "code": "3f.24.14", "name": "Pre-Lift Meeting Not Conducted Before the Job" },
    { "code": "3f.24.15", "name": "PM Plan Not Available" },
    { "code": "3f.24.16", "name": "Quarterly Fitness Check of Lift by OEM Not Done" },
    { "code": "3f.24.17", "name": "Structural Stability Analysis of Lift Not Conducted" },
    { "code": "3f.24.18", "name": "Safety Interlocks Not Available" },
    { "code": "3f.24.19", "name": "Process Specific Controls Missing" },
    { "code": "3f.24.20", "name": "Do’s & Don’ts Not Available in English & Vernacular Language" },
    { "code": "3f.24.21", "name": "No-Go Safety Checklist Not Available" },
    { "code": "3f.24.22", "name": "No-Go Safety Checklist Is Inadequate" },
    { "code": "3f.24.23", "name": "No-Go Safety Checklist Not Followed" },
    { "code": "3f.24.24", "name": "Lift Maintenance/Repair Being Carried Out by Person Other Than OEM" },
    { "code": "3f.24.25", "name": "Persons Engaged in Lift Maintenance/Repair Are Not Trained and Certified" },
    { "code": "3f.24.26", "name": "Liftman Is Not Trained/Authorized Annually" },
    { "code": "3f.24.27", "name": "Rescue Team Not Trained on Emergency Rescue of Lifts" },
    { "code": "3f.24.28", "name": "Caught In/Under Between" },
    { "code": "3f.24.29", "name": "Striking Against Object" },
    { "code": "3f.24.30", "name": "Exposure to High Voltage / Arc Flash" }
  ]
},
{
  "code": "3f.25",
  "name": "JSA (Job Safety Analysis)",
  "items": [
    { "code": "3f.25.1", "name": "Inadequate Identification of Activities/Subactivities" },
    { "code": "3f.25.2", "name": "Inadequate Identification of Hazards" },
    { "code": "3f.25.3", "name": "Inadequate Identification of Controls" },
    { "code": "3f.25.4", "name": "Inadequate Authorization" },
    { "code": "3f.25.5", "name": "Generic JSA" },
    { "code": "3f.25.6", "name": "Controls Mentioned in JSA but Not Implemented on Site" },
    { "code": "3f.25.7", "name": "Updated SOP Not Referred/Not Available" }
  ]
},
{
  "code": "3f.26",
  "name": "Work Environment",
  "items": [
    { "code": "3f.26.1", "name": "Person Found Sleeping in the Workplace/On Duty" },
    { "code": "3f.26.2", "name": "Person Working in Work Alone Situation" },
    { "code": "3f.26.3", "name": "Inadequate Welfare Facilities" },
    { "code": "3f.26.4", "name": "Wastage of Resources (Electricity, Water, etc.)" }
  ]
},
{
  "code": "3f.27",
  "name": "Health",
  "items": [
    { "code": "3f.27.1", "name": "Work Related" },
    { "code": "3f.27.2", "name": "Non-Work Related" },
    { "code": "3f.27.3", "name": "Illness" }
  ]
},
{
  "code": "3f.28",
  "name": "Property Damage",
  "items": [
    { "code": "3f.28.1", "name": "Property Damage" }
  ]
},
{
  "code": "3f.29",
  "name": "Legal/Statutory Requirement",
  "items": [
    { "code": "3f.29.1", "name": "Legal/Statutory Non-Compliance" }
  ]
},
{
  "code": "3f.30",
  "name": "Safe Procedure",
  "items": [
    { "code": "3f.30.1", "name": "Procedure Followed" }
  ]
},
{
  "code": "3f.32",
  "name": "Shaft and Hoisting",
  "items": [
    { "code": "3f.32.1", "name": "In Cage Number of Persons More Than Defined Number" },
    { "code": "3f.32.2", "name": "Emergency System Not Working" },
    { "code": "3f.32.3", "name": "Communication System Not Working" },
    { "code": "3f.32.4", "name": "Maintenance Not Done as per Statutory Requirement" },
    { "code": "3f.32.5", "name": "Winding Engine Driver Unattended, While Person Is at Work in Shaft" },
    { "code": "3f.32.6", "name": "Safety Features Bypassed" },
    { "code": "3f.32.7", "name": "Code of Signals Not Followed" },
    { "code": "3f.32.8", "name": "NO-GO Line Not Available at Inset" },
    { "code": "3f.32.9", "name": "Biometric Access Not Available at Winder Room" },
    { "code": "3f.32.10", "name": "Cage Gate Interlock Not Working" },
    { "code": "3f.32.11", "name": "Magnet Contact Interlock Not Working" },
    { "code": "3f.32.12", "name": "Physical Overwind Switch Not Working" },
    { "code": "3f.32.13", "name": "Cage and Skip Both Running Simultaneously" },
    { "code": "3f.32.14", "name": "Deadman Switch Not Working" },
    { "code": "3f.32.15", "name": "Cage Door Limit Switch Not Working" },
    { "code": "3f.32.16", "name": "Work Carried Out at Headgear While Hoisting Operation Taking Place" },
    { "code": "3f.32.17", "name": "Cage Operated Without Bellman" },
    { "code": "3f.32.18", "name": "Men and Heavy Material Transported at the Same Time" },
    { "code": "3f.32.19", "name": "Track Lock Not Applied During Material Transportation" },
    { "code": "3f.32.20", "name": "Checklist Not Filled by Winder Operator" },
    { "code": "3f.32.21", "name": "Depth Indicator Not Working" },
    { "code": "3f.32.22", "name": "Driver's Desk Hoist Block Switch Not Working" },
    { "code": "3f.32.23", "name": "Tipping Rollers and Lever Arm Not Okay" },
    { "code": "3f.32.24", "name": "Jack Catch Brackets Not Okay" },
    { "code": "3f.32.25", "name": "Handles and Closing Devices Damaged" }
  ]
},
{
  "code": "3f.33",
  "name": "Slope Failure",
  "items": [
    { "code": "3f.33.1", "name": "Undercut on the Benches" },
    { "code": "3f.33.2", "name": "Bench Height Not Maintained" },
    { "code": "3f.33.3", "name": "Bench Width Not Maintained" },
    { "code": "3f.33.4", "name": "Bench Width Less Than Bench Height" },
    { "code": "3f.33.5", "name": "No Proper Drainage on the Benches" },
    { "code": "3f.33.6", "name": "Water Accumulation on the Benches" },
    { "code": "3f.33.7", "name": "Bench Slope Not Maintained" },
    { "code": "3f.33.8", "name": "Overall Pit Slope Not Maintained" },
    { "code": "3f.33.9", "name": "Turning Radius Not Maintained" },
    { "code": "3f.33.10", "name": "Haul Road Gradient Not Maintained" },
    { "code": "3f.33.11", "name": "Insufficient Safety Berm on Haul Road" },
    { "code": "3f.33.12", "name": "Tension Cracks on the Bench" },
    { "code": "3f.33.13", "name": "Erosion on the Benches" },
    { "code": "3f.33.14", "name": "Fencing Not Provided on the Surface" },
    { "code": "3f.33.15", "name": "Bench Access Not Barricaded to Inactive Benches" },
    { "code": "3f.33.16", "name": "Spillage of Materials on Haul Road" },
    { "code": "3f.33.17", "name": "Long Reverse of Dumper to the Loading Face" },
    { "code": "3f.33.18", "name": "Mine Face (Loading Point) Not Properly Leveled" },
    { "code": "3f.33.19", "name": "Dumping Point Not Properly Leveled" },
    { "code": "3f.33.20", "name": "Level Difference on the Mine Benches" },
    { "code": "3f.33.21", "name": "Weak Bench Found Unsupported" },
    { "code": "3f.33.22", "name": "Bench Toe Found Excavated" }
  ]
}
  ]
  }
      
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
