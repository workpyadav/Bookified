import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    }
  },

  images: { remotePatterns: [
    { protocol: 'https', hostname: 'covers.openlibrary.org'},
    { protocol: 'https', hostname: 'ng1jdix5gwviyklq.public.blob.vercel-storage.com'}

  ]}
};

export default nextConfig;
