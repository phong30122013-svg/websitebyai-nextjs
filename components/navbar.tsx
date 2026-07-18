import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UserMenu } from '@/components/user-menu'

export async function Navbar() {
  const session = await getServerSession(authOptions)

  return (
    <header className="fixed top-0 w-full z-50 border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center gap-8">
            <Link href="/" className="font-bold text-xl tracking-tighter text-white">
              Dev<span className="text-zinc-500">Space</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
              <Link href="/snippets" className="hover:text-white transition-colors">Snippets</Link>
              <Link href="/projects" className="hover:text-white transition-colors">Projects</Link>
              <Link href="/marketplace" className="hover:text-white transition-colors">Marketplace</Link>
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {session?.user ? (
              <UserMenu
                name={session.user.name}
                email={session.user.email}
                image={session.user.image}
              />
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link 
                  href="/register" 
                  className="text-sm font-medium bg-white text-zinc-950 px-4 py-2 rounded-md hover:bg-zinc-200 transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
          
        </div>
      </div>
    </header>
  )
}
