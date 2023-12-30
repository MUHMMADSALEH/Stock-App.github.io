import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [stocks, setStocks] = useState([]);
  const [stockPrices, setStockPrices] = useState({});
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/stocks?n=5');
        console.log(response.data.stocks)
        setStocks(response.data.stocks);
        setStockPrices(response.data.stockPrices);
      } catch (error) {
        console.error('Error fetching stock data:', error.message);
      }
    };

    fetchData();
  }, []);

  const updateStockPrices = () => {
    const updatedPrices = { ...stockPrices };
    for (const stock of stocks) {
      updatedPrices[stock.ticker] += Math.random() * 5; // Update with a random value
    }
    setStockPrices(updatedPrices);
  };

  useEffect(() => {
    const interval = setInterval(updateStockPrices, 1000); // Update every second
    return () => clearInterval(interval);
  }, [stocks, stockPrices]);

  return (
    <div>
      <h1>Stocks List</h1>
      <table>
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.ticker}>
              <td>{stock.ticker}</td>
              <td>{stockPrices[stock.ticker]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
