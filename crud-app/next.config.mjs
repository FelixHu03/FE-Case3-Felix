/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
      config.module.rules.push({
        test: /\.(woff|woff2|eot|ttf|otf)$/, // Ekstensi file font
        type: 'asset/resource', // Memastikan file di-handle sebagai aset
      });
      return config;
    },
  };
  
  export default nextConfig;
  