import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  images: {
    // Local blob: URLs and same-origin public assets
    unoptimized: true,
  },
};

export default nextConfig;
