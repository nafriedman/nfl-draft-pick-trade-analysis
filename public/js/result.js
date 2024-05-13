// Objects Selected
const form = document.querySelector('form');
const addPicksT1Btn = document.querySelector('#addTeam1')
const addPicksT2Btn = document.querySelector('#addTeam2')
const removePicksT1Btn = document.querySelector('#removeTeam1')
const removePicksT2Btn = document.querySelector('#removeTeam2')
const resultSection = document.querySelector('#results');

// Helper Functions
const getTeamPicks = (cls) => {
  return Array.from(document.querySelectorAll(cls)).map((p) => p.value)
}
const addInput = (event, teamNb) =>
{
  const inputContainer = event.currentTarget.parentElement.parentElement.parentElement.children[1];
  inputContainer.insertAdjacentHTML('beforeend', `<input type="number" name="team2" class="t${teamNb}_picks" min="1" max="362" value="2">`)
}
const removeInput = (event) =>
{
  const inputContainer = event.currentTarget.parentElement.parentElement.parentElement.children[1];
  if (inputContainer.lastElementChild) {
    inputContainer.lastElementChild.remove(); // Remove the last child element
  }
}
const displayResult = (data) => {
  resultSection.innerHTML = '';
  resultSection.insertAdjacentHTML('beforeend', `<p>Outcome: ${data.outcome}</p>
    <p>Surplus: ${data.surplus}</p>`)
  if (resultSection.classList.contains('hidden')) {
    resultSection.classList.remove('hidden')
  }
}

// Event Listeners
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    const team1Picks = getTeamPicks('.t1_picks')
    const team2Picks = getTeamPicks('.t2_picks')
    const response = await fetch('/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        team1: team1Picks,
        team2: team2Picks
      })
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    displayResult(data);

  } catch (error) {
    console.error('Error:', error);
  }
});

addPicksT1Btn.addEventListener('click', (event) => addInput(event, 1));
addPicksT2Btn.addEventListener('click', (event) => addInput(event, 2));
removePicksT1Btn.addEventListener('click', (event) => removeInput(event));
removePicksT2Btn.addEventListener('click', (event) => removeInput(event));
