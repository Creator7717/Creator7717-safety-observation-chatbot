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
}
  ]
  };

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
