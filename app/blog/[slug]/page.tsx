import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { user: { select: { name: true } } },
  })

  if (!post || !post.published) {
    notFound()
  }

  return (
    <article className="max-w-3xl mx-auto w-full space-y-6">
      <div className="space-y-2">
        <time className="text-sm text-zinc-500">
          {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(post.createdAt)}
          {' · '}
          {post.user?.name || 'Anonymous'}
        </time>
        <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
      </div>
      <div className="max-w-none whitespace-pre-wrap text-zinc-300 leading-relaxed">
        {post.content}
      </div>
    </article>
  )
}
