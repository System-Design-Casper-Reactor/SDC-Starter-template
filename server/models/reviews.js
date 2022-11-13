const db = require('../db/Postgres');

module.exports = {
  getAllReviews: ({ product_id }, { page, count, sort }) => {
    if (sort === 'helpful') {sort = 'helpfulness DESC'};
    if (sort === 'newest') {sort = 'date DESC'};
    if (sort === 'relevant') {sort = 'helpfulness DESC, date DESC'};
    let getPage = page || 0;
    let getCount = count || 5;
    let getSort = sort  || 'helpfulness DESC';

    const queryStr = `SELECT json_build_object(
      'product_id', ${product_id},
      'page', ${getPage},
      'count', ${getCount},
      'results', (SELECT json_agg(row_to_json(reviews))
        FROM (
          SELECT reviews_id, rating, date, summary, body, recommend, reviewer_name, response, helpfulness,
            (SELECT COALESCE(
              json_agg(json_build_object(
                'id', reviews_photos_id,
                'url', url)), '[]')
              FROM reviews_photos
              WHERE reviews_id=review_id) AS photos
          FROM reviews
          WHERE product_id=${product_id} AND reported='false'
          ORDER BY ${getSort}
          OFFSET ${getCount * getPage} ROWS
          FETCH NEXT ${getCount} ROW ONLY
        ) reviews
      )) AS data;`

    return db.query(queryStr)
      .then(result => { return result });
  },

  // explain analyze SELECT json_build_object(
  //   'product_id', 40351,
  //   'page', '0',
  //   'count', '5',
  //   'results', (SELECT json_agg(row_to_json(reviews))
  //     FROM (
  //       SELECT reviews_id, rating, date, summary, body, recommend, reviewer_name, response, helpfulness,
  //         (SELECT COALESCE(
  //           json_agg(json_build_object(
  //             'id', reviews_photos_id,
  //             'url', url)), '[]')
  //           FROM reviews_photos
  //           WHERE reviews_id=review_id) AS photos
  //       FROM reviews
  //       WHERE product_id=40351 AND reported='false'
  //       ORDER BY helpfulness DESC, date DESC
  //       OFFSET 0 ROWS
  //       FETCH NEXT 5 ROW ONLY
  //     ) reviews
  //   )) AS data;

  getMetaInfo: ({ product_id }) => {
    const queryStr = `SELECT json_build_object(
      'product_id', ${product_id},
      'ratings', (SELECT json_build_object(
        '1', (SELECT COUNT(rating)
          FROM reviews
          WHERE product_id=${product_id} AND rating=1),
        '2', (SELECT COUNT(rating)
          FROM reviews
          WHERE product_id=${product_id} AND rating=2),
        '3', (SELECT COUNT(rating)
          FROM reviews
          WHERE product_id=${product_id} AND rating=3),
        '4', (SELECT COUNT(rating)
          FROM reviews
          WHERE product_id=${product_id} AND rating=4),
        '5', (SELECT COUNT(rating)
          FROM reviews
          WHERE product_id=${product_id} AND rating=5)
        )
        FROM reviews
        WHERE product_id=${product_id}
        LIMIT 1),
      'recommended', (SELECT json_build_object(
        'false', (SELECT COUNT(recommend)
          FROM reviews
          WHERE product_id=${product_id} AND recommend='false'),
        'true', (SELECT COUNT(recommend)
          FROM reviews
          WHERE product_id=${product_id} AND recommend='true')
        )
        FROM reviews
        WHERE product_id=${product_id}
        LIMIT 1),
      'characteristics', (SELECT json_object_agg(
        name, (SELECT json_build_object(
          'id', characteristics_id,
          'value', (SELECT AVG(value)
            FROM characteristics_reviews
            WHERE characteristic_id=characteristics_id)
          )
          FROM characteristics_reviews
          LIMIT 1)
        )
        FROM characteristics
        WHERE product_id=${product_id}
      )) AS meta;`
    return db.query(queryStr)
      .then(result => { return result });
  },

  addReview: async ({ product_id, rating, summary, body, recommend, reviewer_name, reviewer_email, photos, characteristics }) => {
    const params = [product_id, rating, summary, body, recommend, reviewer_name, reviewer_email];
    const queryStr = `INSERT INTO reviews(product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
      VALUES($1, $2, now(), $3, $4, $5, false, $6, $7, null, 0)
      RETURNING reviews_id`
    let reviewAdded = await db.query(queryStr, params)
    const reviews_id = reviewAdded.rows[0].reviews_id;

    const photoQueryStr = `INSERT INTO reviews_photos(review_id, url) VALUES($1, unnest($2::text[]));`
    db.query(photoQueryStr, [reviews_id, photos]);

    let char_id = [];
    let charReviewsContainer = [];
    for (let key in characteristics) {
      char_id.push(key);
      charReviewsContainer.push(characteristics[key]);
    }

    const charQueryStr = `INSERT INTO characteristics_reviews(characteristic_id, review_id, value) VALUES(unnest($1::integer[]), $2, unnest($3::integer[]))`
    db.query(charQueryStr, [char_id, reviews_id, charReviewsContainer])
    return;
  },

  markHelpful: ({ review_id }) => {
    const queryStr = `UPDATE reviews SET helpfulness = helpfulness + 1 WHERE reviews_id=${review_id}`
    return db.query(queryStr);
  },

  markReport: ({ review_id }) => {
    const queryStr = `UPDATE reviews SET reported = true WHERE reviews_id=${review_id}`
    return db.query(queryStr);
  }
};