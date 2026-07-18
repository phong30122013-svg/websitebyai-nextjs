import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10)

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@devspace.dev' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@devspace.dev',
      hashedPassword,
    },
  })

  await prisma.snippet.create({
    data: {
      title: 'useLocalStorage hook',
      language: 'TypeScript',
      code: `function useLocalStorage<T>(key: string, initialValue: T) {\n  const [value, setValue] = useState<T>(() => {\n    const saved = localStorage.getItem(key)\n    return saved ? JSON.parse(saved) : initialValue\n  })\n\n  useEffect(() => {\n    localStorage.setItem(key, JSON.stringify(value))\n  }, [key, value])\n\n  return [value, setValue] as const\n}`,
      isPublic: true,
      userId: demoUser.id,
    },
  })

  await prisma.project.create({
    data: {
      title: 'DevSpace Starter Kit',
      description:
        'A high-performance boilerplate for Next.js applications featuring Auth, DB, and Stripe integration.',
      githubUrl: 'https://github.com/example/devspace-starter',
      userId: demoUser.id,
    },
  })

  await prisma.product.create({
    data: {
      title: 'SaaS Landing Page Kit',
      description: 'A conversion-optimized landing page built with Tailwind CSS and Framer Motion.',
      price: 49.0,
      fileUrl: 'https://example.com/downloads/saas-landing-kit.zip',
      userId: demoUser.id,
    },
  })

  await prisma.post.create({
    data: {
      title: 'Building a scalable architecture with Next.js App Router',
      slug: 'building-scalable-architecture-nextjs-app-router',
      content:
        'An in-depth look at how we structure our enterprise Next.js applications for maximum performance and maintainability. We cover server components, data fetching patterns, and how to organize a large App Router codebase.',
      published: true,
      userId: demoUser.id,
    },
  })

  console.log('Seed complete. Demo login: demo@devspace.dev / password123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
