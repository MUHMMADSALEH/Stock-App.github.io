const express = require('express');
const axios = require('axios');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

const STOCKS_FILE_PATH = 'stocks.json';

app.get('/api/stocks', async (req, res) => {
    try {
        const apiKey = 'zUO5ORDqT3YV8O8dQ92G5OfFpu2reyGu';
        // https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/2023-01-09/2023-01-09?apiKey=zUO5ORDqT3YV8O8dQ92G5OfFpu2reyGu
        const n = req.query.n || 5;

        const stocksResponse = await axios.get(`https://api.polygon.io/v2/reference/tickers?type=cs&market=stocks&active=true&sort=ticker&order=asc&limit=${n}&apiKey=${apiKey}`);
        console.log('Stocks Response:', stocksResponse.data);
        

        const stocks = stocksResponse.data.tickers;

        // Fetch previous close for each stock
        const stockPrices = {};
        if (fs.existsSync(STOCKS_FILE_PATH)) {
            const previousPrices = JSON.parse(fs.readFileSync(STOCKS_FILE_PATH, 'utf8'));
            for (const stock of stocks) {
                stockPrices[stock.ticker] = previousPrices[stock.ticker] || 0;
            }
        }

        res.json({ stocks, stockPrices });
    } catch (error) {
        console.error('Error fetching data from Polygon API:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
