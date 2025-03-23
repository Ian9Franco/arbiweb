/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    // Configuración para permitir la lectura de archivos JSON desde el directorio arbipy
    webpack: (config) => {
      config.module.rules.push({
        test: /\.json$/,
        type: "json",
      })
      return config
    },
    // Configuración para permitir acceso a archivos en el directorio arbipy
    experimental: {
      serverComponentsExternalPackages: ["fs", "path"],
    },
  }
  
  module.exports = nextConfig
