import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    // http_req_duration: ['p(95)<200'], // 95% of requests should be below 200ms
    // http_req_duration: ['p(90) < 400', 'p(95) < 800', 'p(99.9) < 2000'],
    // 90% of requests must finish within 400ms, 95% within 800, and 99.9% within 2s.
  },
};

export default function () {
  for (let i = 0; i < 100; i++) {
    let last10Percent = 900000 + Math.floor(Math.random() * 100000)
    const getReviews = http.get(`http://localhost:3001/reviews/${last10Percent}`);
    const getMeta = http.get(`http://localhost:3001/reviews/meta/${last10Percent}`);
    // const helpful = http.put(`http://localhost:3001/reviews/5774955/helpful`);

    check(getReviews, { 'Reviews has status 200': (r) => r.status === 200 })
    check(getMeta, { 'Meta has status 200': (r) => r.status === 200 })
    // check(helpful, {'Helpful has status 202': (r) => r.status === 202})
  }
}