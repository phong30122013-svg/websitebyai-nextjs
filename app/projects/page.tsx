import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getProjects() {
  try {
    return await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } },
    })
  } catch (err) {
    console.error('[PROJECTS_FETCH_ERROR]', err)
    return null
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-zinc-400 mt-2">Showcase of open-source and indie hacking projects.</p>
        </div>
        <Link
          href="/projects/new"
          className="text-sm font-medium bg-white text-zinc-950 px-4 py-2 rounded-md hover:bg-zinc-200 transition-colors h-fit"
        >
          + New Project
        </Link>
      </div>

      {projects === null && (
        <div className="border border-red-900/50 bg-red-950/20 rounded-lg p-6 text-sm text-red-300">
          Không thể kết nối cơ sở dữ liệu. Kiểm tra lại <code>DATABASE_URL</code> trong file .env
          và đảm bảo đã chạy <code>npx prisma db push</code>.
        </div>
      )}

      {projects !== null && projects.length === 0 && (
        <p className="text-zinc-500">Chưa có project nào được đăng.</p>
      )}

      {projects && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/30 hover:border-zinc-700 transition-colors"
            >
              <div className="h-48 bg-zinc-800 relative">
                {project.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
                    Image Placeholder
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-zinc-400 text-sm mb-4">{project.description}</p>
                <div className="flex gap-2 flex-wrap items-center justify-between">
                  <span className="text-xs text-zinc-500">by {project.user?.name || 'Anonymous'}</span>
                  <div className="flex gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs border border-zinc-800 px-2 py-1 rounded-full text-zinc-400 hover:text-white"
                      >
                        GitHub
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs border border-zinc-800 px-2 py-1 rounded-full text-zinc-400 hover:text-white"
                      >
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
