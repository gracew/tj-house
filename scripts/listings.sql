CREATE TABLE listings (
    id SERIAL NOT NULL,
    redfin_region_id text NOT NULL,
    zip_code text,
    street_address text,
    metadata jsonb,
    fetched_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
ALTER TABLE ONLY listings ADD CONSTRAINT pk_listings_id PRIMARY KEY (id);