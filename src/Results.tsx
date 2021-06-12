import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner';
import Listing from './Listing';
import './Results.css';
import { type } from 'os';

function Results() {
  const url = process.env.REACT_APP_TJ_HOUSE_BE_URL || 'http://localhost:5000';
  const [state, setState] = useState<any>('CA');
  const [distance, setDistance] = useState<number>(1);
  const [priceLow, setPriceLow] = useState<number>(200_000);
  const [priceHigh, setPriceHigh] = useState<number>(400_000);
  const [homeChecked, toggleHome] = useState(true);
  const [condoChecked, toggleCondo] = useState(true);
  const [townhouseChecked, toggleTownhouse] = useState(true);
  const [multiFamilyChecked, toggleMultiFamily] = useState(true);
  enum PropertyType {
    Land = 1,
    ResidentialDevelopmentLand = 2,
    Condo = 3,
    MultiFamilySmall = 4, // 2 - 4 units
    MultiFamilyLarge = 5, // 5+
    House = 6,
    Farm = 7,
    VacantLand = 8,
    CoOp = 9,
    ManufacturedHome = 10,
    Parking = 11,
    BoatDock = 12,
    Townhouse = 13
  }
  const [count, setCount] = useState<number>();
  const [rows, setRows] = useState<any[]>([]);
  const [paging, setPaging] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);
  
  function selectState(e: any) {
    setState(e.target.value)
  }

  function selectDistance(e: any) {
    setDistance(e.target.value);
  }

  function selectPriceLow(e: any) {
    if(Number(e.target.value) > Number(priceHigh) - 99999) {
      setPriceHigh(Number(e.target.value) + 100000);
    }
    setPriceLow(e.target.value);
  }

  function selectPriceHigh(e: any) {
    if(Number(e.target.value) < Number(priceLow) + 99999) {
      setPriceLow(Number(e.target.value) - 100000);
    }
    setPriceHigh(e.target.value);
  }

  function selectHome(e: any) {
    toggleHome(e.target.checked);
  }
  function selectCondo(e: any) {
    toggleCondo(e.target.checked);
  }
  function selectTownhouse(e: any) {
    toggleTownhouse(e.target.checked);
  }
  function selectMultiFamily(e: any) {
    toggleMultiFamily(e.target.checked);
  }
  
  function setPropertyTypes(home: boolean, condo: boolean, townhouse: boolean, multiFamily: boolean) {
    let types = [];
    if ( home ) { types.push( PropertyType.House )};
    if ( condo ) { 
      types.push( PropertyType.Condo );
      types.push( PropertyType.CoOp );
    };
    if ( townhouse ) { types.push( PropertyType.Townhouse )};
    if ( multiFamily ) { 
      types.push( PropertyType.MultiFamilySmall );
      types.push( PropertyType.MultiFamilySmall );
    };
    if ( types.length === 0 ) {
      types.push( PropertyType.House );
      toggleHome(true);
    } 
    return types;
  }

  async function getResults() {
    setLoading(true);
    const propertyTypes = setPropertyTypes(homeChecked, condoChecked, townhouseChecked, multiFamilyChecked);
    console.log(priceHigh, distance, state, propertyTypes);
    const res = await fetch(url, {
      method: 'post',
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ priceLow, priceHigh, distance, state, propertyTypes }),
    })
    const parsed = await res.json();
    setCount(parsed.count);
    setRows(parsed.rows);
    setPaging(parsed.paging);
    setLoading(false);
  }

  async function getMoreResults() {
    setMoreLoading(true);
    console.log(priceHigh, distance, state, homeChecked, condoChecked, townhouseChecked, multiFamilyChecked);
    const res = await fetch(url, {
      method: 'post',
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ priceLow, priceHigh, distance, state, offset: paging.nextOffset }),
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
        </Form.Group>
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
        <Form.Group as={Row}>
          <Col xs="12">
            <Form.Label>Price Range 💸</Form.Label>
          </Col>
          <Col xs="6">
            <Form.Control as="select" value={priceLow} onChange={selectPriceLow}>
              <option value={0}>$1</option>
              <option value={100_000}>$100K</option>
              <option value={200_000}>$200K</option>
              <option value={300_000}>$300K</option>
              <option value={400_000}>$400K</option>
              <option value={500_000}>$500K</option>
              <option value={600_000}>$600K</option>
              <option value={700_000}>$700K</option>
              <option value={800_000}>$800K</option>
              <option value={900_000}>$900K</option>
              <option value={1_000_000}>$1M</option>
            </Form.Control>
          </Col>
          <Col xs="6">
            <Form.Control as="select" value={priceHigh} onChange={selectPriceHigh}>
              <option value={100_000}>$100K</option>
              <option value={200_000}>$200K</option>
              <option value={300_000}>$300K</option>
              <option value={400_000}>$400K</option>
              <option value={500_000}>$500K</option>
              <option value={600_000}>$600K</option>
              <option value={700_000}>$700K</option>
              <option value={800_000}>$800K</option>
              <option value={900_000}>$900K</option>
              <option value={1_000_000}>$1M</option>
              <option value={500_000_000}>&gt; $1M</option>
            </Form.Control>
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="houseCheckbox">
          <Col xs="12">
            <Form.Label>Show results for</Form.Label>
          </Col>
          <Col xs="6">
            <Form.Check 
              checked={homeChecked} 
              onChange={selectHome}
              type="checkbox" label="Houses" />
          </Col>
          <Col xs="6">
            <Form.Check 
              checked={townhouseChecked} 
              value="3"
              onChange={selectTownhouse}
              type="checkbox" label="Townhouses" />
            </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Col xs="6">
            <Form.Check 
              checked={condoChecked} 
              value="2"
              onChange={selectCondo}
              type="checkbox"
              label="Condos" />
          </Col>
          <Col xs="6">
            <Form.Check 
              checked={multiFamilyChecked} 
              value="4"
              onChange={selectMultiFamily}
              type="checkbox" label="Multi-family" />
          </Col>
        </Form.Group>
        <Button className="form-submit" variant="primary" onClick={getResults}>
          Let's Go!
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
