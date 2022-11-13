require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
});

// pool.query(`DROP TABLE IF EXISTS reviews, reviews_photos, characteristics, characteristics_reviews;`);

// CHANGING ALL DATE TO regular time!
// ALTER TABLE reviews ALTER COLUMN date TYPE TIMESTAMP USING to_timestamp(date/1000);

// async () => {}

pool.query(`CREATE TABLE IF NOT EXISTS reviews(
  reviews_id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  rating TEXT NOT NULL,
  date TEXT NOT NULL,
  summary TEXT,
  body TEXT NOT NULL,
  recommend BOOLEAN NOT NULL,
  reported BOOLEAN NOT NULL,
  reviewer_name VARCHAR(60) NOT NULL,
  reviewer_email VARCHAR(60) NOT NULL,
  response TEXT,
  helpfulness INT NOT NULL);`
);

pool.query(`CREATE TABLE IF NOT EXISTS characteristics(
  characteristics_id SERIAL PRIMARY KEY,
  product_id TEXT NOT NULL,
  name VARCHAR(60) NOT NULL);`
);

pool.query(`CREATE TABLE IF NOT EXISTS reviews_photos(
  reviews_photos_id SERIAL PRIMARY KEY,
  review_id INT NOT NULL,
  url TEXT,
  CONSTRAINT fk_reviews
    FOREIGN KEY(review_id)
      REFERENCES reviews(reviews_id)
  );`
);

pool.query(`CREATE TABLE IF NOT EXISTS characteristics_reviews(
  characteristics_reviews_id SERIAL PRIMARY KEY,
  characteristic_id INT NOT NULL,
  review_id INT NOT NULL,
  value SMALLINT NOT NULL,
  CONSTRAINT fk_characteristics
    FOREIGN KEY(characteristic_id)
      REFERENCES characteristics(characteristics_id),
  CONSTRAINT fk_cr_reviews
    FOREIGN KEY(review_id)
      REFERENCES reviews(reviews_id)
  );`
);

  // CREATE INDEX FOR faster GET req.

pool.query(`CREATE INDEX IF NOT EXISTS idx_product_id ON reviews (product_id)`);
pool.query(`CREATE INDEX IF NOT EXISTS idx_photo_review_id ON reviews_photos (review_id)`);
pool.query(`CREATE INDEX IF NOT EXISTS idx_char_review_id ON characteristics_reviews (review_id)`);
pool.query(`CREATE INDEX IF NOT EXISTS idx_review_char_id ON characteristics_reviews (characteristic_id)`);
// pool.query(`CREATE INDEX IF NOT EXISTS idx_char_id ON characteristics (characteristics_id)`);
// pool.query(`CREATE INDEX IF NOT EXISTS idx_char_value ON characteristics_reviews (value)`);




  // Reviews // Characteristics // photos // char_reviews
// pool.query(`COPY reviews (reviews_id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) FROM '/Users/hieungo/HackReactor/rps2209/SDC-Reviews-DB/server/db/data/reviews.csv' DELIMITER ',' CSV HEADER;`).then(() => console.log('copied into reviews'));

// pool.query(`COPY characteristics (characteristics_id, product_id, name) FROM '/Users/hieungo/HackReactor/rps2209/SDC-Reviews-DB/server/db/data/characteristics.csv' DELIMITER ',' CSV HEADER;`).then(() => console.log('copied into characteristics'))

// pool.query(`COPY reviews_photos (reviews_photos_id, review_id, url) FROM '/Users/hieungo/HackReactor/rps2209/SDC-Reviews-DB/server/db/data/reviews_photos.csv' DELIMITER ',' CSV HEADER;`).then(() => console.log('copied into reviews_photos'));

// pool.query(`COPY characteristics_reviews (characteristics_reviews_id, characteristic_id, review_id, value) FROM '/Users/hieungo/HackReactor/rps2209/SDC-Reviews-DB/server/db/data/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;`).then(() => console.log('copied into characteristics_reviews'));


/*  reviews, characteristics, reviews_photos, characteristics_reviews */
// pool.query(`SELECT setval(pg_get_serial_sequence('reviews', 'reviews_id'), (select max(reviews_id) from reviews));`).then(() => console.log('Sequence updated for reviews'));

// pool.query(`SELECT setval(pg_get_serial_sequence('characteristics', 'characteristics_id'), (select max(characteristics_id) from characteristics));`).then(() => console.log('Sequence updated for characteristics'));

// pool.query(`SELECT setval(pg_get_serial_sequence('reviews_photos', 'reviews_photos_id'), (select max(reviews_photos_id) from reviews_photos));`).then(() => console.log('Sequence updated for reviews_photos'));

// pool.query(`SELECT setval(pg_get_serial_sequence('characteristics_reviews', 'characteristics_reviews_id'), (select max(characteristics_reviews_id) from characteristics_reviews));`).then(() => console.log('Sequence updated for characteristics_reviews'));

module.exports = pool;