import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 400, // virtual users
  duration: '60s',
};


export default function () {
  let last10Percent = 900000 + Math.floor(Math.random() * 100000)
  const getReviews = http.get(`http://localhost:3001/reviews/${last10Percent}`);
  const getMeta = http.get(`http://localhost:3001/reviews/meta/${last10Percent}`);
  // const helpful = http.put(`http://localhost:3001/reviews/5774955/helpful`);

  check(getReviews, {'Reviews has status 200': (r) => r.status === 200})
  check(getMeta, {'Meta has status 200': (r) => r.status === 200})
  // check(helpful, {'Helpful has status 202': (r) => r.status === 202})
}


// export default function () {
//   // vu code: do things here...
// }