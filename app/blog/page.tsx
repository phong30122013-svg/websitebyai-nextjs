import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getPosts() {
  try {
    return await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } },
    })
  } catch (err) {
    console.error('[POSTS_FETCH_ERROR]', err)
    return null
  }
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <div className="max-w-3xl mx-auto space-y-12 w-full">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
          <p className="text-zinc-400 mt-2">Thoughts, tutorials, and insights on modern web development.</p>
        </div>
        <Link
          href="/blog/new"
          className="text-sm font-medium bg-white text-zinc-950 px-4 py-2 rounded-md hover:bg-zinc-200 transition-colors h-fit"
        >
          + Write Post
        </Link>
      </div>

      {posts === null && (
        <div className="border border-red-900/50 bg-red-950/20 rounded-lg p-6 text-sm text-red-300">
          Không thể kết nối cơ sở dữ liệu. Kiểm tra lại <code>DATABASE_URL</code> trong file .env
          và đảm bảo đã chạy <code>npx prisma db push</code>.
        </div>
      )}

      {posts !== null && posts.length === 0 && (
        <p className="text-zinc-500">Chưa có bài viết nào được xuất bản.</p>
      )}

      {posts && posts.length > 0 && (
        <div className="space-y-10">
          {posts.map((post) => (
            <article key={post.id} className="group flex flex-col gap-2">
              <time className="text-sm text-zinc-500">
                {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(post.createdAt)}
                {' · '}
                {post.user?.name || 'Anonymous'}
              </time>
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-xl font-semibold group-hover:text-blue-400 transition-colors cursor-pointer">
                  {post.title}
                </h2>
              </Link>
              <p className="text-zinc-400 line-clamp-3">{post.content}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="flex items-center text-sm text-zinc-300 font-medium mt-2 group-hover:text-blue-400"
              >
                Read article <span className="ml-1">→</span>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
