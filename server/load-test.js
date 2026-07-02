import http from 'k6/http';
import { check, sleep } from 'k6';

// Define the traffic simulation shape
export const options = {
  stages: [
    { duration: '10s', target: 50 }, // Ramp up from 1 to 50 users over 10 seconds
    { duration: '20s', target: 50 }, // Stay at 50 users for 20 seconds
    { duration: '5s', target: 0 },   // Ramp down to 0 users over 5 seconds
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'], // Contract: Less than 1% of requests should fail
    http_req_duration: ['p(95)<200'], // 95% of requests must finish under 200ms
  },
};

export default function () {
  const res = http.get('http://localhost:3000/api/invoices?page=1&limit=10');

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
