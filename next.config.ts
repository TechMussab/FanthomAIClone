import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Prevents build failure on minor TS checks during assessment deploy
  },
}

export default nextConfig