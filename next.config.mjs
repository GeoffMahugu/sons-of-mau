/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "www.parliament.go.ke", // Replace with your actual domain
      },
    ],
  },
};

export default nextConfig;