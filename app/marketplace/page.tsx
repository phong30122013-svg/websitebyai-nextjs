import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getProducts() {
  try {
    return await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    })
  } catch (err) {
    console.error('[PRODUCTS_FETCH_ERROR]', err)
    return null
  }
}

export default async function MarketplacePage() {
  const products = await getProducts()

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
          <p className="text-zinc-400 mt-2">Premium components, templates, and digital assets.</p>
        </div>
        <Link
          href="/marketplace/new"
          className="text-sm font-medium bg-white text-zinc-950 px-4 py-2 rounded-md hover:bg-zinc-200 transition-colors h-fit"
        >
          + List Product
        </Link>
      </div>

      {products === null && (
        <div className="border border-red-900/50 bg-red-950/20 rounded-lg p-6 text-sm text-red-300">
          Không thể kết nối cơ sở dữ liệu. Kiểm tra lại <code>DATABASE_URL</code> trong file .env
          và đảm bảo đã chạy <code>npx prisma db push</code>.
        </div>
      )}

      {products !== null && products.length === 0 && (
        <p className="text-zinc-500">Chưa có sản phẩm nào trên marketplace.</p>
      )}

      {products && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border border-zinc-800 rounded-lg p-5 flex flex-col">
              <div className="h-40 bg-zinc-900 rounded mb-4 flex items-center justify-center text-zinc-700 text-sm overflow-hidden">
                {product.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                  'Preview'
                )}
              </div>
              <h3 className="font-medium mb-1">{product.title}</h3>
              <p className="text-sm text-zinc-500 mb-4 line-clamp-2">{product.description}</p>
              <div className="mt-auto flex items-center justify-between">
                <span className="font-semibold">${product.price.toFixed(2)}</span>
                <a
                  href={product.fileUrl}
                  className="text-sm bg-white text-zinc-950 px-3 py-1.5 rounded hover:bg-zinc-200 font-medium"
                >
                  Buy Now
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
