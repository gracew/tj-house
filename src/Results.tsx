import React, { useState } from 'react';
import './App.css';


// https://stackoverflow.com/a/2901298
function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function Results() {
  const [distance, setDistance] = useState<number>(1);
  const [price, setPrice] = useState<number>(250_000);
  const [data, setData] = useState<any[]>([]);

  function selectDistance(e: any) {
    setDistance(e.target.value);
  }

  function selectPrice(e: any) {
    setPrice(e.target.value);
  }

  async function getResults() {
    const url = process.env.REACT_APP_TJ_HOUSE_BE_URL || 'http://localhost:5000';
    const res = await fetch(url, {
      method: 'post',
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ price, distance }),
    })
    setData(await res.json());
  }

  return (
    <div className="Results">
      <div>Distance 📍</div>
      <select value={distance} onChange={selectDistance}>
        <option value={1}>&lt; 1 mi</option>
        <option value={2}>&lt; 2 mi</option>
        <option value={5}>&lt; 5 mi</option>
        <option value={10}>&lt; 10 mi</option>
        <option value={20}>&lt; 20 mi</option>
      </select>

      <div>Price 💸</div>
      <select value={price} onChange={selectPrice}>
        <option value={100_000}>&lt; $100K</option>
        <option value={250_000}>&lt; $250K</option>
        <option value={500_000}>&lt; $500K</option>
        <option value={1_000_000}>&lt; $1M</option>
        <option value={5_000_000}>&lt; $5M</option>
      </select>
      <button onClick={getResults}>Go!</button>

      {data.map(d => <div key={d.id}>
        <h3><a href={"https://redfin.com" + d.metadata.url}>{d.metadata.streetLine.value}</a></h3>
        <div>${numberWithCommas(d.metadata.price.value)}</div>
        <div>{d.closest_tj_distance_mi.toFixed(3)} mi away from {d.tj_name}</div>
        <div>{d.tj_address}</div>
      </div>)}
    </div>
  );
}

export default Results;
