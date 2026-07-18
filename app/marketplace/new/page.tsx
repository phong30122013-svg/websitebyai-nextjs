import { createProduct } from '@/lib/actions'

export default function NewProductPage() {
  return (
    <div className="max-w-2xl mx-auto w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">List a Product</h1>
        <p className="text-zinc-400 mt-2">Sell a template, component, or digital asset.</p>
      </div>

      <form action={createProduct} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <input
            name="title"
            required
            className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-zinc-600"
            placeholder="SaaS Landing Page Kit"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <textarea
            name="description"
            required
            rows={4}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-zinc-600"
            placeholder="A conversion-optimized landing page built with Tailwind CSS..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Price (USD)</label>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-zinc-600"
              placeholder="49.00"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Image URL</label>
            <input
              name="imageUrl"
              type="url"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-zinc-600"
              placeholder="https://.../preview.png"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Download / File URL</label>
          <input
            name="fileUrl"
            type="url"
            required
            className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-zinc-600"
            placeholder="https://.../download.zip or a checkout link"
          />
        </div>

        <button
          type="submit"
          className="bg-white text-zinc-950 font-medium rounded-md px-6 py-2 hover:bg-zinc-200 transition-colors"
        >
          List Product
        </button>
      </form>
    </div>
  )
}
