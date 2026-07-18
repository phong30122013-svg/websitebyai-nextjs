import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
      <div className="space-y-4 max-w-2xl">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white">
          Build the ultimate <br/>
          <span className="text-zinc-500">developer ecosystem</span>
        </h1>
        <p className="text-zinc-400 text-lg sm:text-xl">
          Everything you need in one place: Snippets, Projects showcase, Marketplace, and a Developer Blog. Powered by Next.js and Neon.
        </p>
      </div>
      
      <div className="flex gap-4">
        <Link 
          href="/projects" 
          className="bg-white text-zinc-950 px-6 py-3 rounded-md font-medium hover:bg-zinc-200 transition-colors"
        >
          Explore Projects
        </Link>
        <Link 
          href="/snippets" 
          className="border border-zinc-800 text-zinc-300 px-6 py-3 rounded-md font-medium hover:bg-zinc-900 transition-colors"
        >
          View Snippets
        </Link>
      </div>
    </div>
  )
}
