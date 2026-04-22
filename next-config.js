// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Jika menggunakan gambar dari domain eksternal, tambahkan di sini
  images: {
    domains: [],
  },
  // Pastikan output standar (bukan 'export')
  output: 'standalone', // direkomendasikan untuk Vercel (opsional)
};

module.exports = nextConfig;