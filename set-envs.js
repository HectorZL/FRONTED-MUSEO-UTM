const fs = require('fs');
const path = require('path');
// Load environment variables from .env file if it exists
require('dotenv').config();

// Define the target paths for the environment files
const targetPath = path.join(__dirname, './src/environments/environment.ts');
const targetPathProd = path.join(__dirname, './src/environments/environment.prod.ts');

// Get environment variables or use defaults
// Default to the existing values if env vars are not set
const apiUrl = process.env.API_URL || 'https://galeria-museo-utm.onrender.com/api';
const jwtKey = process.env.JWT_KEY || '^k$j9X2HNZSG4rfz7&IdFeZkJh2mgJ';

// Create the content for the environment files
const envConfigFile = `export const environment = {
  production: false,
  apiUrl: '${apiUrl}',
  jwtKey: '${jwtKey}'
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
  }
};
`;

const envConfigProdFile = `export const environment = {
  production: true,
  apiUrl: '${apiUrl}',
  jwtKey: '${jwtKey}'
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
  }
};
`;

// Write the files
fs.writeFile(targetPath, envConfigFile, (err) => {
    if (err) {
        console.error('Error writing environment.ts:', err);
        throw err;
    }
    console.log(`Angular environment.ts file generated correctly at ${targetPath} \n`);
});

fs.writeFile(targetPathProd, envConfigProdFile, (err) => {
    if (err) {
        console.error('Error writing environment.prod.ts:', err);
        throw err;
    }
    console.log(`Angular environment.prod.ts file generated correctly at ${targetPathProd} \n`);
});
