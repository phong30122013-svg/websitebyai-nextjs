import { createPost } from '@/lib/actions'

export default function NewPostPage() {
  return (
    <div className="max-w-2xl mx-auto w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Write a Post</h1>
        <p className="text-zinc-400 mt-2">Share a tutorial or insight with the community.</p>
      </div>

      <form action={createPost} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <input
            name="title"
            required
            className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-zinc-600"
            placeholder="Building a scalable architecture with Next.js App Router"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Content</label>
          <textarea
            name="content"
            required
            rows={12}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-zinc-600"
            placeholder="Write your post in plain text or Markdown..."
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-zinc-400">
          <input type="checkbox" name="published" defaultChecked className="accent-white" />
          Publish immediately
        </label>

        <button
          type="submit"
          className="bg-white text-zinc-950 font-medium rounded-md px-6 py-2 hover:bg-zinc-200 transition-colors"
        >
          Publish Post
        </button>
      </form>
    </div>
  )
}
