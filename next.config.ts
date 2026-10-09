import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Local blob: URLs and same-origin public assets
    unoptimized: true,
  },
};

export default nextConfig;
