/** @type {import('next').NextConfig} */
const nextConfig = {
  // Don't leak "X-Powered-By: Next.js" to every response.
  poweredByHeader: false,

  experimental: {
    serverActions: {
      // Caps the payload size accepted by Server Actions (createSnippet,
      // createProject, createProduct, createPost) so a client can't send an
      // enormous request body to tie up server/DB resources.
      bodySizeLimit: '1mb',
    },
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ]
  },
}

export default nextConfig
