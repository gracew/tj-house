CREATE TABLE zip_code_distances (
    id SERIAL NOT NULL,
    zip_codes text[],
    distance_mi real
);
ALTER TABLE ONLY zip_code_distances ADD CONSTRAINT pk_zip_code_distances_id PRIMARY KEY (id);
CREATE INDEX idx_zip_code_distances_zip_codes ON zip_code_distances USING gin (zip_codes);
CREATE INDEX idx_zip_code_distances_distance_mi ON zip_code_distances USING btree (distance_mi);