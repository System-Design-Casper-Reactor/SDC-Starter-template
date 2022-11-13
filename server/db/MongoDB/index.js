require('dotenv').config();
const mongoose = require('mongoose');

main().catch(err => console.log('error connecting: ', err));

async function main() {
  await mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`);
}

const reviewsSchema = mongoose.Schema(
  {
    product: Number,
    page: Number,
    count: Number,
    results: [{
      review_id: Number,
      rating: Number,
      summary: String,
      recommended: { type: Boolean, default: false },
      response: { type: String, default: null },
      body: String,
      date: Date,
      reviewer_name: String,
      reported: { type: Boolean, default: false }
      reviewer_email: { type: String, unique: true, lowercase: true }
      helpfulness: { type: Number, default: 0 },
      photos: [{ id: Number, url: String, default: null, }]
    }]
  }
)

const Reviews = mongoose.model('Reviews', reviewsSchema)

const metaSchema = mongoose.Schema(
  {
    product_id: Number,
    ratings: { '1': Number, '2': Number, '3': Number, '4': Number, '5': Number },
    recommended: { no: Number, yes: Number },
    characteristics: {
      size: { id: Number, value: Number },
      width: { id: Number, value: Number },
      comfort: { id: Number, value: Number },
      quality: { id: Number, value: Number },
      length: { id: Number, value: Number },
      fit: { id: Number, value: Number }
    }
  }
)

const Meta = mongoose.model('Meta', metaSchema)

module.exports = {
  Reviews,
  Meta
}