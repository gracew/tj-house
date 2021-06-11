CREATE TABLE listings (
    id SERIAL NOT NULL,
    redfin_region_id text NOT NULL,
    zip_code text,
    state text,
    price integer,
    property_type integer,
    metadata jsonb,
    fetched_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    closest_tj_store_no integer,
    closest_tj_distance_mi real
);
ALTER TABLE ONLY listings ADD CONSTRAINT pk_listings_id PRIMARY KEY (id);
CREATE INDEX idx_listings_zip_code ON listings (zip_code);
CREATE INDEX idx_listings_closest_tj_distance_mi_price_property_type ON listings (closest_tj_distance_mi, price, property_type);
CREATE INDEX idx_listings_closest_tj_distance_mi_price_property_type_state ON listings (closest_tj_distance_mi, price, property_type, state);