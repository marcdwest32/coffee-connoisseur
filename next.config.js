const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      'images.unsplash.com',
      's3-media1.fl.yelpcdn.com',
      's3-media2.fl.yelpcdn.com',
      's3-media3.fl.yelpcdn.com',
      's3-media4.fl.yelpcdn.com',
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
    }

    return config
  },
  env: {},
}

module.exports = nextConfig
