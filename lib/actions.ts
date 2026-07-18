'use server'

import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
  snippetSchema,
  projectSchema,
  productSchema,
  postSchema,
} from '@/lib/validations'

async function requireUserId() {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string } | undefined)?.id
  if (!userId) {
    throw new Error('Bạn cần đăng nhập để thực hiện thao tác này.')
  }
  return userId
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 100)
}

// Turns the first Zod issue into a short, user-facing Vietnamese message
// instead of leaking schema internals.
function firstIssueMessage(error: import('zod').ZodError) {
  return error.issues[0]?.message || 'Dữ liệu không hợp lệ.'
}

export async function createSnippet(formData: FormData) {
  const userId = await requireUserId()

  const parsed = snippetSchema.safeParse({
    title: String(formData.get('title') || ''),
    language: String(formData.get('language') || ''),
    code: String(formData.get('code') || ''),
    isPublic: formData.get('isPublic') === 'on',
  })

  if (!parsed.success) {
    throw new Error(firstIssueMessage(parsed.error))
  }

  await prisma.snippet.create({
    data: { ...parsed.data, userId },
  })

  revalidatePath('/snippets')
  redirect('/snippets')
}

export async function createProject(formData: FormData) {
  const userId = await requireUserId()

  const parsed = projectSchema.safeParse({
    title: String(formData.get('title') || ''),
    description: String(formData.get('description') || ''),
    demoUrl: String(formData.get('demoUrl') || ''),
    githubUrl: String(formData.get('githubUrl') || ''),
    imageUrl: String(formData.get('imageUrl') || ''),
  })

  if (!parsed.success) {
    throw new Error(firstIssueMessage(parsed.error))
  }

  await prisma.project.create({
    data: { ...parsed.data, userId },
  })

  revalidatePath('/projects')
  redirect('/projects')
}

export async function createProduct(formData: FormData) {
  const userId = await requireUserId()

  const parsed = productSchema.safeParse({
    title: String(formData.get('title') || ''),
    description: String(formData.get('description') || ''),
    price: parseFloat(String(formData.get('price') || '0')),
    imageUrl: String(formData.get('imageUrl') || ''),
    fileUrl: String(formData.get('fileUrl') || ''),
  })

  if (!parsed.success) {
    throw new Error(firstIssueMessage(parsed.error))
  }

  await prisma.product.create({
    data: { ...parsed.data, userId },
  })

  revalidatePath('/marketplace')
  redirect('/marketplace')
}

export async function createPost(formData: FormData) {
  const userId = await requireUserId()

  const parsed = postSchema.safeParse({
    title: String(formData.get('title') || ''),
    content: String(formData.get('content') || ''),
    published: formData.get('published') === 'on',
  })

  if (!parsed.success) {
    throw new Error(firstIssueMessage(parsed.error))
  }

  const baseSlug = slugify(parsed.data.title) || 'post'
  const existing = await prisma.post.findUnique({ where: { slug: baseSlug } })
  const slug = existing ? `${baseSlug}-${Date.now()}` : baseSlug

  await prisma.post.create({
    data: { ...parsed.data, slug, userId },
  })

  revalidatePath('/blog')
  redirect('/blog')
}
