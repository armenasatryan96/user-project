const jwt = require('jsonwebtoken');

const payload = { sub: 'test', email: 'test@example.com' };
const secret = 'your-super-secret-jwt-key-at-least-32-characters-long-for-security';
const expiresIn = '1h';

console.log('Payload:', payload);
console.log('Secret length:', secret.length);
console.log('ExpiresIn:', expiresIn);

try {
  const token = jwt.sign(payload, secret, { expiresIn });
  console.log('Token generated successfully:', token.substring(0, 50) + '...');
} catch (error) {
  console.error('Error generating token:', error.message);
}
