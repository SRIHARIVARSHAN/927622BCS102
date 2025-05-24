const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9876;

const URL = 'http://20.244.56.144/test/numbers/';
const VALID_IDS = ['p', 'f', 'e', 'r'];
const WINSIZE = 10;
let numberWindow = [];

async function getnum(id) {
  try {
    const response = await axios.get(`${URL}${id}`, { timeout: 500 });
    return response.data.numbers || [];
  } catch (error) {
    return [];
  }
}

function calcAvg(arr) {
  if (arr.length === 0) return 0;
  const sum = arr.reduce((acc, num) => acc + num, 0);
  return parseFloat((sum / arr.length).toFixed(2));
}

app.get('/numbers/:id', async (req, res) => {
  const id = req.params.id;
  if (!VALID_IDS.includes(id)) {
    return res.status(400).json({ error: 'Invalid ID. Use p, f, e, or r.' });
  }
  const windowPrevState = [...numberWindow];
  const newNumbers = await getnum(id);
  const uniqueNewNumbers = newNumbers.filter(num => !numberWindow.includes(num));
  numberWindow = [...numberWindow, ...uniqueNewNumbers];
  if (numberWindow.length > WINSIZE) {
    numberWindow = numberWindow.slice(-WINSIZE); 
  }
  const avg = calcAvg(numberWindow);
  res.json({
    windowPrevState,
    windowCurrState: numberWindow,
    numbers: newNumbers,
    avg
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
