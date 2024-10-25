document.getElementById('submit').addEventListener('click', async () => {
  const observation = document.getElementById('observation').value;
  const responseDiv = document.getElementById('response');

  if (!observation) {
    responseDiv.textContent = 'Please enter a safety observation.';
    return;
  }

  responseDiv.textContent = 'Categorizing...';

  try {
 const response = await fetch('https://safety-observation-app.netlify.app/.netlify/functions/categorize_observation', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ observation })
});


    const data = await response.json();

    if (data.error) {
      responseDiv.textContent = `Error: ${data.error}`;
    } else {
      responseDiv.textContent = `The observation falls under:\n${data.result}`;
    }
  } catch (error) {
    console.error(error);
    responseDiv.textContent = 'An error occurred while processing your observation.';
  }
});
