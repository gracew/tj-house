CREATE TABLE zip_code_to_redfin_region_id (
    zip_code text NOT NULL,
    redfin_region_id text NOT NULL
);
ALTER TABLE ONLY zip_code_to_redfin_region_id ADD CONSTRAINT pk_zip_code_to_redfin_region_id_zip_code PRIMARY KEY (zip_code);