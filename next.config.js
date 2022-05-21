/** @type {import('next').NextConfig} */
const npm = require('./package.json');

const nextConfig = {
  reactStrictMode: true,
  env: {
    TOKEN: process.env.TOKEN,
    BUILD: process.env.BUILD,
    VERSION: npm.version,
  }
}

module.exports = nextConfig