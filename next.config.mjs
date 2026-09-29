/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
    ],
  },
  eslint: {
    // next build's own lint pass hits a known upstream bug serializing the
    // flat-config parser (vercel/next.js#64409-style "Cannot serialize key
    // 'parse'" error). Linting itself still works via `npm run lint` and
    // editor integrations; this only skips the redundant build-time pass.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
