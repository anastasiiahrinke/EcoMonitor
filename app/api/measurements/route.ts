import { NextRequest, NextResponse } from "next/server";
import { measurements } from "@/data/measurements";
import { PaginatedResponse, Measurement, ApiError, AirQualityData } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const stationId = searchParams.get("stationId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
    const sortBy = searchParams.get("sortBy") as keyof AirQualityData | null;
    const sortOrder = searchParams.get("sortOrder") === "desc" ? "desc" : "asc";

    if (!stationId) {
      const error: ApiError = {
        success: false,
        error: { code: "MISSING_PARAM", message: "Параметр stationId є обов'язковим" },
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(error, { status: 400 });
    }

    let filtered = measurements.filter((m) => m.stationId === stationId);

    if (startDate) {
      filtered = filtered.filter((m) => m.date >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter((m) => m.date <= endDate);
    }

    if (sortBy) {
      const validKeys: (keyof AirQualityData)[] = ["pm25", "pm10", "no2", "so2", "co", "o3", "aqi"];
      if (validKeys.includes(sortBy)) {
        filtered.sort((a, b) => {
          const diff = a.airQuality[sortBy] - b.airQuality[sortBy];
          return sortOrder === "asc" ? diff : -diff;
        });
      }
    } else {
      filtered.sort((a, b) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`));
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paged = filtered.slice(start, start + limit);

    const response: PaginatedResponse<Measurement> = {
      success: true,
      data: paged,
      page,
      limit,
      total,
      totalPages,
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
