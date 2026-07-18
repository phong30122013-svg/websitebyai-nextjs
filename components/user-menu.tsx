'use client'

import { useState, useRef, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'

export function UserMenu({
  name,
  email,
  image,
}: {
  name?: string | null
  email?: string | null
  image?: string | null
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const initial = (name || email || '?').charAt(0).toUpperCase()

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm font-medium text-white hover:border-zinc-600 transition-colors overflow-hidden"
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={name ?? 'User'} className="w-full h-full object-cover" />
        ) : (
          initial
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-md border border-zinc-800 bg-zinc-950 shadow-lg py-1 text-sm">
          <div className="px-3 py-2 border-b border-zinc-800">
            <p className="font-medium text-white truncate">{name || 'Người dùng'}</p>
            <p className="text-zinc-500 truncate text-xs">{email}</p>
          </div>
          <Link
            href="/snippets/new"
            className="block px-3 py-2 text-zinc-300 hover:bg-zinc-900 hover:text-white"
            onClick={() => setOpen(false)}
          >
            Tạo Snippet mới
          </Link>
          <Link
            href="/projects/new"
            className="block px-3 py-2 text-zinc-300 hover:bg-zinc-900 hover:text-white"
            onClick={() => setOpen(false)}
          >
            Đăng Project mới
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full text-left px-3 py-2 text-red-400 hover:bg-zinc-900 hover:text-red-300"
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  )
}
