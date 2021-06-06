import React from 'react';
import './App.css';
import data from "./output.json";


function Results() {
  return (
    <div className="Results">
      {data.map(d => <div key={d.tj['Store No.']}>
        <h3>{d.tj.Name}</h3>
        <div># listings in {d.tj.Zip_Code}: {d.listings.length}</div>
        {d.listings.map((l: any) => <div>
          <a href={"https://redfin.com" + l.url}>{l.streetLine.value}</a>
        </div>)}
      </div>)}
    </div>
  );
}

export default Results;
