import { NextRequest, NextResponse } from "next/server";
import { stations } from "@/data/stations";
import { measurements } from "@/data/measurements";
import { calculateAverage } from "@/lib/utils";
import { ApiResponse, ApiError, MonitoringStation, AirQualityData } from "@/types";
import logger from "@/lib/logger";

interface StationDetail {
  station: MonitoringStation;
  latestMeasurement: AirQualityData | null;
  averageToday: AirQualityData | null;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    logger.info({ msg: "GET /api/stations/:id", stationId: id });
    const station = stations.find((s) => s.id === id);

    if (!station) {
      const error: ApiError = {
        success: false,
        error: { code: "NOT_FOUND", message: `Станцію з id "${id}" не знайдено` },
        timestamp: new Date().toISOString(),
      };
      logger.warn({ msg: "Station not found", stationId: id });
      return NextResponse.json(error, { status: 404 });
    }

    const stationMeasurements = measurements
      .filter((m) => m.stationId === id)
      .sort((a, b) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`));

    const latest = stationMeasurements[0]?.airQuality ?? null;

    const today = new Date().toISOString().split("T")[0]!;
    const todayMeasurements = stationMeasurements.filter((m) => m.date === today);
    const avgToday = calculateAverage(todayMeasurements);

    const response: ApiResponse<StationDetail> = {
      success: true,
      data: { station, latestMeasurement: latest, averageToday: avgToday },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch {
    logger.error({ msg: "Unhandled error in GET /api/stations/:id" });
    const error: ApiError = {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Внутрішня помилка сервера" },
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(error, { status: 500 });
  }
}
