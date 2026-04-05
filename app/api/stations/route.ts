import { NextRequest, NextResponse } from "next/server";
import { stations } from "@/data/stations";
import { ApiResponse, MonitoringStation, ApiError } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const type = searchParams.get("type");
    const active = searchParams.get("active");

    let filtered = [...stations];

    if (type) {
      const validTypes = ["industrial", "urban", "suburban", "rural", "traffic"];
      if (!validTypes.includes(type)) {
        const error: ApiError = {
          success: false,
          error: { code: "INVALID_TYPE", message: `Невірний тип станції: ${type}` },
          timestamp: new Date().toISOString(),
        };
        return NextResponse.json(error, { status: 400 });
      }
      filtered = filtered.filter((s) => s.type === type);
    }

    if (active !== null) {
      filtered = filtered.filter((s) => s.active === (active === "true"));
    }

    const response: ApiResponse<MonitoringStation[]> = {
      success: true,
      data: filtered,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch {
    const error: ApiError = {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Внутрішня помилка сервера" },
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(error, { status: 500 });
  }
}
