import { viewBirthday } from "@/lib/birthday/view";
import { ApiError } from "@/lib/rateLimit";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const data = await viewBirthday(id);

  if (!data)
    return NextResponse.json({
      error: ApiError.NOT_FOUND,
    });

  return NextResponse.json({
    success: true,
    data,
  });
}
