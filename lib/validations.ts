import { z } from 'zod'

// Every string field has an explicit max length. This isn't about SQL
// injection (Prisma always sends parameterized queries, so raw input can't
// alter query structure) — it's about rejecting oversized/malformed payloads
// before they reach the database, which is a cheap way to blunt abusive or
// automated flooding of write endpoints.

export const registerSchema = z.object({
  name: z.string().trim().max(100).optional().or(z.literal('')),
  email: z.string().trim().toLowerCase().email('Email không hợp lệ').max(255),
  password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự').max(72),
})

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Email không hợp lệ').max(255),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu').max(72),
})

const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === '' || /^https?:\/\//i.test(v), 'URL phải bắt đầu bằng http:// hoặc https://')
  .optional()
  .transform((v) => (v ? v : null))

export const snippetSchema = z.object({
  title: z.string().trim().min(1, 'Tiêu đề là bắt buộc').max(200),
  language: z.string().trim().min(1, 'Ngôn ngữ là bắt buộc').max(50),
  code: z.string().min(1, 'Mã nguồn là bắt buộc').max(20_000, 'Mã nguồn quá dài (tối đa 20.000 ký tự)'),
  isPublic: z.boolean(),
})

export const projectSchema = z.object({
  title: z.string().trim().min(1, 'Tiêu đề là bắt buộc').max(200),
  description: z.string().trim().min(1, 'Mô tả là bắt buộc').max(5_000),
  demoUrl: optionalUrl,
  githubUrl: optionalUrl,
  imageUrl: optionalUrl,
})

export const productSchema = z.object({
  title: z.string().trim().min(1, 'Tiêu đề là bắt buộc').max(200),
  description: z.string().trim().min(1, 'Mô tả là bắt buộc').max(5_000),
  price: z
    .number({ invalid_type_error: 'Giá không hợp lệ' })
    .min(0, 'Giá không được âm')
    .max(1_000_000, 'Giá quá lớn'),
  imageUrl: optionalUrl,
  fileUrl: z
    .string()
    .trim()
    .min(1, 'Link file/tải về là bắt buộc')
    .max(1000)
    .refine((v) => /^https?:\/\//i.test(v), 'URL phải bắt đầu bằng http:// hoặc https://'),
})

export const postSchema = z.object({
  title: z.string().trim().min(1, 'Tiêu đề là bắt buộc').max(300),
  content: z.string().trim().min(1, 'Nội dung là bắt buộc').max(50_000, 'Nội dung quá dài (tối đa 50.000 ký tự)'),
  published: z.boolean(),
})
