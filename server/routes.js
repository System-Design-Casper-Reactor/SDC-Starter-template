const express = require('express');
const router = express.Router();
const controllers = require('./controllers/reviews');

router.get('/reviews/:product_id', controllers.getReviews);
router.get('/reviews/meta/:product_id', controllers.getMeta);
router.post('/reviews/:product_id', controllers.postReview);
router.put('/reviews/:review_id/helpful', controllers.helpfulReview);
router.put('/reviews/:review_id/report', controllers.reportReview);

module.exports = router;