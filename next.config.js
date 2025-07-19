/** @type {import('next').NextConfig} */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  staticPageGenerationTimeout: 300,
  output: 'standalone',

  images: {
    domains: ['api.mapbox.com', 'picsum.photos'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.mapbox.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      }
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60, // Reduced for dynamic images
    dangerouslyAllowSVG: true,
  },

  webpack: (config, { isServer }) => {
    config.resolve.fallback = { 
      ...config.resolve.fallback,
      punycode: require.resolve('punycode/')
    };

    config.ignoreWarnings = [
      { 
        module: /node_modules[\\/]punycode/,
        message: /.*punycode.*/
      },
      { 
        module: /node_modules[\\/]@react-aria/,
        message: /.*useLayoutEffect.*/
      }
    ];

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false
      };
    }

    return config;
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ],
      },
    ];
  },

  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  }
};

export default nextConfig;