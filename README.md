# DevSpace

Auth, Snippets, Projects, Marketplace, and Blog — built with Next.js 14 (App Router),
Tailwind CSS, Prisma ORM, and Neon Postgres.

## Đã triển khai trong bản này

- **Bước 1 — Database:** schema Prisma đầy đủ, thêm `hashedPassword` cho `User` để hỗ trợ đăng nhập email/mật khẩu.
- **Bước 2 — Auth:** NextAuth (Auth.js) v4 với `CredentialsProvider` (email/mật khẩu, hash bằng bcrypt) + GitHub OAuth tuỳ chọn. `PrismaAdapter` lưu Account/Session. Navbar là Server Component đọc session và hiển thị avatar/menu người dùng khi đã đăng nhập. `middleware.ts` bảo vệ các route `/snippets/new`, `/projects/new`, `/marketplace/new`, `/blog/new`.
- **Bước 3 — Data fetching:** 4 trang danh sách (`/snippets`, `/projects`, `/marketplace`, `/blog`) là Server Components truy vấn trực tiếp qua Prisma, có fallback báo lỗi nếu chưa kết nối DB.
- **Bước 4 — CRUD:** Server Actions trong `lib/actions.ts` (`createSnippet`, `createProject`, `createProduct`, `createPost`) + form tạo mới tương ứng tại `/snippets/new`, `/projects/new`, `/marketplace/new`, `/blog/new`. Trang chi tiết bài viết tại `/blog/[slug]`.

## Bắt đầu

```bash
npm install
```

### 1. Cấu hình `.env`

Điền connection string Neon Postgres thật vào `DATABASE_URL` và `DIRECT_URL`.

Tạo `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

GitHub OAuth (`GITHUB_ID` / `GITHUB_SECRET`) là tuỳ chọn — để trống thì chỉ dùng đăng nhập email/mật khẩu.

### 2. Đồng bộ schema lên database

```bash
npx prisma db push
```

### 3. (Tuỳ chọn) Seed dữ liệu mẫu

```bash
npm run db:seed
```

Tạo sẵn 1 tài khoản demo: `demo@devspace.dev` / `password123`, cùng 1 snippet, 1 project, 1 sản phẩm marketplace, và 1 bài blog.

### 4. Chạy dev server

```bash
npm run dev
```

## Ghi chú kỹ thuật

- Session dùng chiến lược **JWT** (bắt buộc khi có Credentials provider — `PrismaAdapter` với DB session chỉ hỗ trợ OAuth).
- Đăng ký tài khoản mới qua `POST /api/register`, sau đó tự động đăng nhập.
- Các trang danh sách dùng `export const dynamic = 'force-dynamic'` để luôn lấy dữ liệu mới nhất — có thể đổi sang ISR (`revalidate`) khi cần tối ưu hiệu năng.
- Muốn bảo vệ thêm route (ví dụ trang dashboard cá nhân), thêm path vào `matcher` trong `middleware.ts`.

## Bảo mật

- **SQL injection:** mọi truy vấn đều đi qua Prisma Client (`prisma.snippet.create`, `prisma.post.findUnique`, v.v.), Prisma luôn dùng **parameterized queries** nên input người dùng không thể chèn vào cấu trúc câu lệnh SQL. Dự án không dùng `$queryRawUnsafe`/`$executeRawUnsafe` ở đâu cả.
- **Validate & giới hạn input:** toàn bộ form (đăng ký, đăng nhập, tạo snippet/project/product/post) được validate bằng `zod` (`lib/validations.ts`) với giới hạn độ dài rõ ràng cho từng trường — chặn payload bất thường/quá khổ trước khi chạm tới DB.
- **Rate limiting (`lib/rate-limit.ts` + `middleware.ts`):**
  - `/api/register`, `/api/auth/callback/credentials`, `/api/auth/signin`: tối đa 10 request/phút/IP — chống brute-force mật khẩu và dò tài khoản.
  - Mọi Server Action ghi dữ liệu (tạo snippet/project/product/post): tối đa 20 request/phút/IP — chống spam/flood ghi vào database.
  - Mặc định dùng bộ đếm in-memory (đủ cho dev/1 instance). Khi deploy production nhiều instance, cấu hình `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` trong `.env` để rate limit dùng chung qua Redis — bắt buộc nếu chạy serverless (Vercel) hoặc nhiều server phía sau load balancer.
- **Giới hạn payload:** `next.config.mjs` giới hạn body size của Server Actions ở 1MB (`experimental.serverActions.bodySizeLimit`).
- **Security headers:** `next.config.mjs` thêm `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`, và tắt header `X-Powered-By`.
- **Kết nối DB:** dùng connection string **pooled** (PgBouncer, host có `-pooler`) của Neon cho `DATABASE_URL` để một đợt request tăng đột biến không làm cạn số connection trực tiếp tới Postgres.

**Giới hạn cần lưu ý:** rate limiting và validate input ở tầng ứng dụng giúp chống spam/brute-force và bảo vệ database, nhưng **không thay thế** một lớp chống DDoS ở tầng mạng thực sự (ví dụ Cloudflare, AWS Shield, hay WAF của nhà cung cấp hosting) — nếu lo ngại về DDoS quy mô lớn (băng thông/số lượng kết nối), nên đặt ứng dụng sau một CDN/WAF.

## Việc tiếp theo có thể làm

- Trang chỉnh sửa / xoá cho Snippet, Project, Product, Post (hiện tại mới có tạo mới).
- Thanh toán thật cho Marketplace (Stripe Checkout) thay vì link file trực tiếp.
- Phân trang hoặc infinite scroll cho các trang danh sách khi dữ liệu lớn.
- Trang profile công khai cho từng user (`/u/[id]`).
# websitebyai-nextjs
