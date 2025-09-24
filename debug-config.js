require('dotenv').config();

console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('JWT_EXPIRES_IN:', process.env.JWT_EXPIRES_IN);
console.log('JWT_SECRET length:', process.env.JWT_SECRET?.length);
