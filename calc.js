const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9876;

const URL = 'http://20.244.56.144/evaluation-service/';
const VALID_IDS = {
    p: 'primes',
    f: 'fibo',
    e: 'even',
    r: 'rand'
};

const WINSIZE = 10;
let numberWindow = [];

async function getnum(id) {
    try {
        const response = await axios.get(`${URL}${VALID_IDS[id]}`, {
            timeout:3000,
            headers: {
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ4MDY5MzExLCJpYXQiOjE3NDgwNjkwMTEsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjA4N2U1Mzc2LWI3NzctNDAxZS1hN2NhLTY3ZmUwOGE1NWM1ZiIsInN1YiI6InNyaWhhcml2YXJzaGFuckBnbWFpbC5jb20ifSwiZW1haWwiOiJzcmloYXJpdmFyc2hhbnJAZ21haWwuY29tIiwibmFtZSI6InNyaSBoYXJpdmFyc2hhbiByIiwicm9sbE5vIjoiOTI3NjIyYmNzMTAyIiwiYWNjZXNzQ29kZSI6IndoZVFVeSIsImNsaWVudElEIjoiMDg3ZTUzNzYtYjc3Ny00MDFlLWE3Y2EtNjdmZTA4YTU1YzVmIiwiY2xpZW50U2VjcmV0IjoiQWhtdnRNUktockRRdmZjVCJ9.26xf-OCK0CnDtsfcIFuUQpg3XZKfzEd7rqWSEM-kgvo'
            }
        });
        console.log("Calling:", `${URL}${VALID_IDS[id]}`);
        console.log("Token:", 'Bearer your_token_here');

        console.log("API Response:", response.data);

        return response.data.numbers || [];
    } catch (error) {
  console.log("Error fetching:", error.message);
  if (error.response) {
    console.log("Response data:", error.response.data);
    console.log("Status code:", error.response.status);
  }
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
    if (!VALID_IDS[id]) {
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
