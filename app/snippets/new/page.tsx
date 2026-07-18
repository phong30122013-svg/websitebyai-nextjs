import { createSnippet } from '@/lib/actions'

export default function NewSnippetPage() {
  return (
    <div className="max-w-2xl mx-auto w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Snippet</h1>
        <p className="text-zinc-400 mt-2">Share a reusable piece of code with the community.</p>
      </div>

      <form action={createSnippet} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <input
            name="title"
            required
            className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-zinc-600"
            placeholder="useLocalStorage hook"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Language</label>
          <input
            name="language"
            required
            className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-zinc-600"
            placeholder="TypeScript"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Code</label>
          <textarea
            name="code"
            required
            rows={10}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:border-zinc-600"
            placeholder="function useLocalStorage() { ... }"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-zinc-400">
          <input type="checkbox" name="isPublic" defaultChecked className="accent-white" />
          Public (visible in the snippets feed)
        </label>

        <button
          type="submit"
          className="bg-white text-zinc-950 font-medium rounded-md px-6 py-2 hover:bg-zinc-200 transition-colors"
        >
          Publish Snippet
        </button>
      </form>
    </div>
  )
}
