const models = require('../models/reviews');

module.exports = {
  getReviews: (req, res) => {
    models.getAllReviews(req.params, req.query)
      .then(result => {
        res.status(200).send(result.rows[0].data)
      })
      .catch(err => res.status(404).send('controller retrieval failed: ', err));
  },

  getMeta: (req, res) => {
    models.getMetaInfo(req.params)
      .then(result => res.status(200).send(result.rows[0].meta))
      .catch(err => res.status(404).send('Error getting meta: ', err));
  },

  postReview: (req, res) => {
    models.addReview(req.body)
      .then(() => res.status(201).end())
      .catch(err => res.status(404).send('Error POSTING reviews', err));
  },

  helpfulReview: (req, res) => {
    models.markHelpful(req.params)
      .then(result => res.status(202).end())
      .catch(err => res.status(404).send('Error marking review as helpful ', err))
  },

  reportReview: (req, res) => {
    models.markReport(req.params)
      .then(result => res.status(202).end())
      .catch(err => res.status(404).send('Error reporting ', err))
  }
};