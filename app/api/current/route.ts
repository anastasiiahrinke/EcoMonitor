import { NextResponse } from "next/server";
import { stations } from "@/data/stations";
import { measurements } from "@/data/measurements";
import { ApiResponse, ApiError, AirQualityData, MonitoringStation } from "@/types";

interface CurrentReading {
  station: MonitoringStation;
  current: AirQualityData;
  measuredAt: string;
}

export async function GET() {
  try {
    const results: CurrentReading[] = [];

    for (const station of stations) {
      if (!station.active) continue;
      const stationMeasurements = measurements
        .filter((m) => m.stationId === station.id)
        .sort((a, b) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`));

      const latest = stationMeasurements[0];
      if (latest) {
        results.push({
          station,
          current: latest.airQuality,
          measuredAt: `${latest.date}T${latest.time}`,
        });
      }
    }

    const response: ApiResponse<CurrentReading[]> = {
      success: true,
      data: results,
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
