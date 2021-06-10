import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import Listing from './Listing';
import './Results.css';

function Results() {
  const url = process.env.REACT_APP_TJ_HOUSE_BE_URL || 'http://localhost:5000';
  const [state, setState] = useState<any>('CA');
  const [distance, setDistance] = useState<number>(1);
  const [price, setPrice] = useState<number>(250_000);

  const [count, setCount] = useState<number>();
  const [rows, setRows] = useState<any[]>([]);
  const [paging, setPaging] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);

  function selectState(e: any) {
    setState(e.target.value);
  }

  function selectDistance(e: any) {
    setDistance(e.target.value);
  }

  function selectPrice(e: any) {
    setPrice(e.target.value);
  }

  async function getResults() {
    setLoading(true);
    const res = await fetch(url, {
      method: 'post',
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ price, distance, state }),
    })
    const parsed = await res.json();
    setCount(parsed.count);
    setRows(parsed.rows);
    setPaging(parsed.paging);
    setLoading(false);
  }

  async function getMoreResults() {
    setMoreLoading(true);
    const res = await fetch(url, {
      method: 'post',
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ price, distance, state, offset: paging.nextOffset }),
    })
    const parsed = await res.json();
    setRows([...rows, ...parsed.rows])
    setPaging(parsed.paging);
    setMoreLoading(false);
  }

  return (
    <div className="Results">
      <Form className="results-form">
        <Form.Group>
        <Form.Label>State 🇺🇸</Form.Label>
          <Form.Control as="select" value={state} onChange={selectState}>
            <option value={'AL'}>Alabama</option>
            <option value={'AK'}>Alaska</option>
            <option value={'AZ'}>Arizona</option>
            <option value={'AR'}>Arkansas</option>
            <option value={'CA'}>California</option>
            <option value={'CO'}>Colorado</option>
            <option value={'CT'}>Connecticut</option>
            <option value={'DE'}>Delaware</option>
            <option value={'DC'}>District Of Columbia</option>
            <option value={'FL'}>Florida</option>
            <option value={'GA'}>Georgia</option>
            <option value={'HI'}>Hawaii</option>
            <option value={'ID'}>Idaho</option>
            <option value={'IL'}>Illinois</option>
            <option value={'IN'}>Indiana</option>
            <option value={'IA'}>Iowa</option>
            <option value={'KS'}>Kansas</option>
            <option value={'KY'}>Kentucky</option>
            <option value={'LA'}>Louisiana</option>
            <option value={'ME'}>Maine</option>
            <option value={'MD'}>Maryland</option>
            <option value={'MA'}>Massachusetts</option>
            <option value={'MI'}>Michigan</option>
            <option value={'MN'}>Minnesota</option>
            <option value={'MS'}>Mississippi</option>
            <option value={'MO'}>Missouri</option>
            <option value={'MT'}>Montana</option>
            <option value={'NE'}>Nebraska</option>
            <option value={'NV'}>Nevada</option>
            <option value={'NH'}>New Hampshire</option>
            <option value={'NJ'}>New Jersey</option>
            <option value={'NM'}>New Mexico</option>
            <option value={'NY'}>New York</option>
            <option value={'NC'}>North Carolina</option>
            <option value={'ND'}>North Dakota</option>
            <option value={'OH'}>Ohio</option>
            <option value={'OK'}>Oklahoma</option>
            <option value={'OR'}>Oregon</option>
            <option value={'PA'}>Pennsylvania</option>
            <option value={'RI'}>Rhode Island</option>
            <option value={'SC'}>South Carolina</option>
            <option value={'SD'}>South Dakota</option>
            <option value={'TN'}>Tennessee</option>
            <option value={'TX'}>Texas</option>
            <option value={'UT'}>Utah</option>
            <option value={'VT'}>Vermont</option>
            <option value={'VA'}>Virginia</option>
            <option value={'WA'}>Washington</option>
            <option value={'WV'}>West Virginia</option>
            <option value={'WI'}>Wisconsin</option>
            <option value={'WY'}>Wyoming</option>
          </Form.Control>
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
            <option value={200_000}>$100K - $200K</option>
            <option value={300_000}>$200K - $300K</option>
            <option value={400_000}>$300K - $400K</option>
            <option value={500_000}>$400K - $500K</option>
            <option value={500_000}>$500K - $600K</option>
            <option value={500_000}>$600K - $700K</option>
            <option value={500_000}>$700K - $800K</option>
            <option value={500_000}>$800K - $900K</option>
            <option value={1_000_000}>$900K - $1M</option>
            <option value={500_000_000}>&gt; $1M</option>
          </Form.Control>
        </Form.Group>

        <Button className="form-submit" variant="primary" onClick={getResults}>
          Go!
          {loading && <Spinner className="loading-status" as="span" animation="grow" size="sm" role="status" aria-hidden="true" />}
        </Button>
      </Form>

      {count && <div>{count} results</div>}
      <div className="listings">
        {!loading && rows.map((d: any) => <Listing
          key={d.id}
          metadata={d.metadata}
          closest_tj_distance_mi={d.closest_tj_distance_mi}
          tj_name={d.tj_name}
          tj_address={d.tj_address}
        />)}
      </div>
      {paging && paging.moreResults &&
        <Button className="load-more" variant="primary" onClick={getMoreResults}>
          Load more
          {moreLoading && <Spinner className="loading-status" as="span" animation="grow" size="sm" role="status" aria-hidden="true" />}
        </Button>
      }
    </div>
  );
}

export default Results;
