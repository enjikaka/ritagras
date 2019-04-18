import dotenv from 'dotenv';

const dotenvResult = dotenv.config();

if (dotenvResult.error) {
  throw new Error('Could not read .env file.');
}

const { parsed: config } = dotenvResult;

console.log(config);
