import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Navbar } from '@/components/navbar'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DevSpace | Next.js Big Build',
  description: 'Full shell with Auth, Snippets, Projects, Marketplace, Blog',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark"> 
      <body className={`${inter.className} bg-zinc-950 text-zinc-50 min-h-screen antialiased flex flex-col`}>
        <Providers>
          <Navbar />
          <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
