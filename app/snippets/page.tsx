import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getSnippets() {
  try {
    return await prisma.snippet.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } },
    })
  } catch (err) {
    console.error('[SNIPPETS_FETCH_ERROR]', err)
    return null
  }
}

export default async function SnippetsPage() {
  const snippets = await getSnippets()

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Code Snippets</h1>
          <p className="text-zinc-400 mt-2">Reusable code blocks for your next project.</p>
        </div>
        <Link
          href="/snippets/new"
          className="text-sm font-medium bg-white text-zinc-950 px-4 py-2 rounded-md hover:bg-zinc-200 transition-colors h-fit"
        >
          + New Snippet
        </Link>
      </div>

      {snippets === null && (
        <div className="border border-red-900/50 bg-red-950/20 rounded-lg p-6 text-sm text-red-300">
          Không thể kết nối cơ sở dữ liệu. Kiểm tra lại <code>DATABASE_URL</code> trong file .env
          và đảm bảo đã chạy <code>npx prisma db push</code>.
        </div>
      )}

      {snippets !== null && snippets.length === 0 && (
        <p className="text-zinc-500">Chưa có snippet nào. Hãy là người đầu tiên đăng!</p>
      )}

      {snippets && snippets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {snippets.map((snippet) => (
            <div key={snippet.id} className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-mono bg-zinc-800 px-2 py-1 rounded text-zinc-300">
                  {snippet.language}
                </span>
                <span className="text-xs text-zinc-500">{snippet.user?.name || 'Anonymous'}</span>
              </div>
              <h3 className="font-medium mb-2">{snippet.title}</h3>
              <div className="h-32 bg-zinc-950 rounded border border-zinc-800 p-4 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950/90 pointer-events-none" />
                <pre className="text-xs text-zinc-400 font-mono whitespace-pre-wrap">{snippet.code}</pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
