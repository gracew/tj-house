import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import Listing from './Listing';
import './Results.css';

function Results() {
  const [distance, setDistance] = useState<number>(1);
  const [price, setPrice] = useState<number>(250_000);

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  function selectDistance(e: any) {
    setDistance(e.target.value);
  }

  function selectPrice(e: any) {
    setPrice(e.target.value);
  }

  async function getResults() {
    setLoading(true);
    const url = process.env.REACT_APP_TJ_HOUSE_BE_URL || 'http://localhost:5000';
    const res = await fetch(url, {
      method: 'post',
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ price, distance }),
    })
    setData(await res.json());
    setLoading(false);
  }

  return (
    <div className="Results">
      <Form className="results-form">
        <Form.Group>
          <Form.Label>Distance 📍</Form.Label>
          <Form.Control as="select" value={distance} onChange={selectDistance}>
            <option value={1}>&lt; 1 mi</option>
            <option value={2}>&lt; 2 mi</option>
            <option value={5}>&lt; 5 mi</option>
            <option value={10}>&lt; 10 mi</option>
            <option value={20}>&lt; 20 mi</option>
          </Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label>Price 💸</Form.Label>
          <Form.Control as="select" value={price} onChange={selectPrice}>
            <option value={100_000}>&lt; $100K</option>
            <option value={250_000}>&lt; $250K</option>
            <option value={500_000}>&lt; $500K</option>
            <option value={1_000_000}>&lt; $1M</option>
            <option value={5_000_000}>&lt; $5M</option>
          </Form.Control>
        </Form.Group>

        <Button className="form-submit" variant="primary" onClick={getResults}>
          Go!
          {loading && <Spinner className="loading-status" as="span" animation="grow" size="sm" role="status" aria-hidden="true" />}
        </Button>
      </Form>

      <div className="listings">
        {!loading && data.map(d => <Listing
          key={d.id}
          metadata={d.metadata}
          closest_tj_distance_mi={d.closest_tj_distance_mi}
          tj_name={d.tj_name}
          tj_address={d.tj_address}
        />)}
      </div>
    </div>
  );
}

export default Results;
