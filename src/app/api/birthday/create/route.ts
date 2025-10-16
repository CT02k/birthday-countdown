import { NextRequest, NextResponse } from "next/server";
import { ApiError, checkRateLimit } from "@/lib/rateLimit";
import { createBirthday } from "@/lib/birthday/create";

export async function POST(req: NextRequest) {
  const { limited, res } = await checkRateLimit(req, 10, 60);
  const { limit, remaining } = res;

  if (limited) {
    return NextResponse.json(
      {
        error: ApiError.RATE_LIMITED,
        limit,
        remaining,
      },
      { status: 429 },
    );
  }

  let data;

  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: ApiError.INVALID_DATA }, { status: 400 });
  }

  const { name, date } = data;

  if (!name || !date)
    return NextResponse.json(
      {
        error: ApiError.MISSING_FIELDS,
      },
      {
        status: 400,
      },
    );

  const birthdayData = await createBirthday({ name, date });

  return NextResponse.json({
    success: true,
    data: birthdayData,
    limit,
    remaining,
  });
}
