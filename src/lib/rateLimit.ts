import redis from "@/lib/redis";
import { NextRequest } from "next/server";

export enum ApiError {
  RATE_LIMITED,
  MISSING_FIELDS,
  INVALID_DATA,
  NOT_FOUND,
}

export interface Res {
  error: ApiError;
  limit: number;
  remaining: number;
}

export interface RateLimitResult {
  limited: boolean;
  res: Res;
}

export async function checkRateLimit(
  req: NextRequest,
  limitPerMinute = 10,
  windowInSeconds = 60,
): Promise<RateLimitResult> {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const key = `ratelimit:${ip}`;

  const requests = await redis.incr(key);

  if (requests === 1) {
    await redis.expire(key, windowInSeconds);
  }

  if (requests > limitPerMinute) {
    return {
      limited: true,
      res: {
        error: ApiError.RATE_LIMITED,
        limit: limitPerMinute,
        remaining: 0,
      },
    };
  }

  return {
    limited: false,
    res: {
      error: ApiError.RATE_LIMITED,
      limit: limitPerMinute,
      remaining: limitPerMinute - requests,
    },
  };
}
