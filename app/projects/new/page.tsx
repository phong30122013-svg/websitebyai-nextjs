import { createProject } from '@/lib/actions'

export default function NewProjectPage() {
  return (
    <div className="max-w-2xl mx-auto w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Project</h1>
        <p className="text-zinc-400 mt-2">Showcase something you&apos;ve built.</p>
      </div>

      <form action={createProject} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <input
            name="title"
            required
            className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-zinc-600"
            placeholder="Project Alpha"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <textarea
            name="description"
            required
            rows={4}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-zinc-600"
            placeholder="A high-performance boilerplate for Next.js applications..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Demo URL</label>
            <input
              name="demoUrl"
              type="url"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-zinc-600"
              placeholder="https://myproject.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">GitHub URL</label>
            <input
              name="githubUrl"
              type="url"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-zinc-600"
              placeholder="https://github.com/you/repo"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Image URL</label>
          <input
            name="imageUrl"
            type="url"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-zinc-600"
            placeholder="https://.../screenshot.png"
          />
        </div>

        <button
          type="submit"
          className="bg-white text-zinc-950 font-medium rounded-md px-6 py-2 hover:bg-zinc-200 transition-colors"
        >
          Publish Project
        </button>
      </form>
    </div>
  )
}
