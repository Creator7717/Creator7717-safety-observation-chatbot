// app.js
 
document.addEventListener('DOMContentLoaded', () => {
  // Get references to HTML elements
  const observationInput = document.getElementById('observation');
  const submitButton = document.getElementById('submit');
  const responseDiv = document.getElementById('response');
 
  // Add event listener to the submit button
  submitButton.addEventListener('click', async () => {
    // Get the observation text
    const observation = observationInput.value.trim();
 
    // Clear any previous response
    responseDiv.textContent = '';
 
    if (!observation) {
      responseDiv.textContent = 'Please enter a safety observation.';
      return;
    }
 
    // Display a loading message or spinner
    responseDiv.textContent = 'Categorizing...';
 
    try {
      // Send the observation to your serverless function
      const response = await fetch('https://creator7717-safety-observation-chatbot.vercel.app/api/categorize_observation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ observation })
      });
 
      // Parse the JSON response
      const data = await response.json();
 
      if (response.ok) {
        // Display the categorized result
        const result = data.result;
 
        if (result.rawResult) {
          // If the result couldn't be parsed, display the raw result
          responseDiv.textContent = `Categorization Result:\n${result.rawResult}`;
        } else {
          // Display the structured categorization
          responseDiv.textContent = `The observation falls under:
Category: ${result.categoryCode} - ${result.categoryName}
Subcategory: ${result.subcategoryCode} - ${result.subcategoryName}
Item: ${result.itemCode} - ${result.itemName}`;
        }
      } else {
        // Display an error message
        responseDiv.textContent = `Error: ${data.error}`;
      }
    } catch (error) {
      console.error('Error:', error);
      responseDiv.textContent = 'An error occurred while processing your observation.';
    }
  });
});
 
