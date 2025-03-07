/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = {
  images: {
    domains: [
      'yourmainsite.com',
      'api.yourdomain.com',
      'localhost'
    ],
  },
}

module.exports = nextConfig;