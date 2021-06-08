import React from 'react';
import Card from 'react-bootstrap/Card';
import "./Listing.css";

// https://stackoverflow.com/a/2901298
function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

interface ListingProps {
  metadata: any;
  closest_tj_distance_mi: number;
  tj_name: string;
  tj_address: string;
}

function Listing(props: ListingProps) {
  return (
    <a className="listing" href={"https://redfin.com" + props.metadata.url} target="_blank" rel="noreferrer">
      <Card>
        <div className="card-img-wrapper"><Card.Img src={"https://ssl.cdn-redfin.com/photo/" + props.metadata.dataSourceId + "/bigphoto/" + props.metadata.mlsId.value.substr(-3) + "/" + props.metadata.mlsId.value + "_0.jpg"} /></div>
        <Card.Body>
          <Card.Title>{props.metadata.streetLine.value}</Card.Title>
          <Card.Subtitle>${numberWithCommas(props.metadata.price.value)}</Card.Subtitle>
          <Card.Text>
            <div>{props.closest_tj_distance_mi.toFixed(3)} mi away from</div>
            <div>{props.tj_name}</div>
            <div className="tj-address">{props.tj_address}</div>
          </Card.Text>
        </Card.Body>
      </Card>
    </a>
  );
}

export default Listing;
