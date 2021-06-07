CREATE TABLE listings (
    id SERIAL NOT NULL,
    redfin_region_id text NOT NULL,
    zip_code text,
    street_address text,
    price integer,
    metadata jsonb,
    fetched_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
ALTER TABLE ONLY listings ADD CONSTRAINT pk_listings_id PRIMARY KEY (id);
CREATE INDEX idx_listings_zip_code ON listings USING btree (zip_code);