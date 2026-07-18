import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export type RateLimitResult = {
  success: boolean
  remaining: number
  /** Seconds until the caller can retry. */
  retryAfter: number
}

// In-memory fallback store. Good enough for local dev / a single server
// instance. It does NOT share state across multiple serverless invocations
// or servers behind a load balancer — for real production DDoS/brute-force
// protection, set UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN so the
// Redis-backed limiter below is used instead.
type Bucket = { count: number; reset: number }
const memoryBuckets = new Map<string, Bucket>()

function memoryRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()

  // Probabilistic cleanup instead of setInterval — background timers aren't
  // reliable in edge/serverless runtimes where each invocation is short-lived.
  if (Math.random() < 0.01) {
    for (const [k, bucket] of memoryBuckets) {
      if (now > bucket.reset) memoryBuckets.delete(k)
    }
  }

  const bucket = memoryBuckets.get(key)

  if (!bucket || now > bucket.reset) {
    memoryBuckets.set(key, { count: 1, reset: now + windowMs })
    return { success: true, remaining: limit - 1, retryAfter: 0 }
  }

  if (bucket.count >= limit) {
    return { success: false, remaining: 0, retryAfter: Math.ceil((bucket.reset - now) / 1000) }
  }

  bucket.count += 1
  return { success: true, remaining: limit - bucket.count, retryAfter: 0 }
}

const hasUpstash = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
)

const redis = hasUpstash
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null

const limiterCache = new Map<string, Ratelimit>()

function getRedisLimiter(limit: number, windowSeconds: number) {
  const cacheKey = `${limit}:${windowSeconds}`
  let limiter = limiterCache.get(cacheKey)
  if (!limiter && redis) {
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
      analytics: false,
    })
    limiterCache.set(cacheKey, limiter)
  }
  return limiter
}

/**
 * Rate-limit a key (typically `${ip}:${route}`) to `limit` requests per
 * `windowSeconds`. Uses shared Redis when configured, otherwise an
 * in-memory fallback scoped to this server instance.
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  if (redis) {
    const limiter = getRedisLimiter(limit, windowSeconds)
    if (limiter) {
      const { success, remaining, reset } = await limiter.limit(key)
      return { success, remaining, retryAfter: Math.max(0, Math.ceil((reset - Date.now()) / 1000)) }
    }
  }
  return memoryRateLimit(key, limit, windowSeconds * 1000)
}
