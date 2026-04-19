import { Measurement } from "@/types";

function generateMeasurements(
  stationId: string,
  days: number
): Measurement[] {
  const results: Measurement[] = [];
  const baseDate = new Date("2026-04-01");

  const stationProfiles: Record<string, { pm25: number; pm10: number; no2: number; so2: number; co: number; o3: number }> = {
    "station-1": { pm25: 35, pm10: 55, no2: 40, so2: 12, co: 0.8, o3: 45 },
    "station-2": { pm25: 55, pm10: 80, no2: 60, so2: 25, co: 1.2, o3: 30 },
    "station-3": { pm25: 20, pm10: 35, no2: 25, so2: 8, co: 0.5, o3: 55 },
    "station-4": { pm25: 10, pm10: 20, no2: 15, so2: 5, co: 0.3, o3: 65 },
    "station-5": { pm25: 45, pm10: 70, no2: 55, so2: 18, co: 1.5, o3: 35 },
    "station-6": { pm25: 50, pm10: 75, no2: 58, so2: 22, co: 1.3, o3: 28 },
    "station-7": { pm25: 25, pm10: 40, no2: 30, so2: 10, co: 0.6, o3: 50 },
    "station-8": { pm25: 8, pm10: 12, no2: 7, so2: 3, co: 0.2, o3: 18 },
    "station-9": { pm25: 95, pm10: 140, no2: 110, so2: 38, co: 2.1, o3: 24 },
    "station-10": { pm25: 22, pm10: 36, no2: 26, so2: 7, co: 0.5, o3: 48 },
    "station-11": { pm25: 16, pm10: 28, no2: 18, so2: 6, co: 0.4, o3: 52 },
    "station-12": { pm25: 18, pm10: 30, no2: 20, so2: 6, co: 0.45, o3: 49 },
    "station-13": { pm25: 40, pm10: 66, no2: 52, so2: 17, co: 1.1, o3: 33 },
    "station-14": { pm25: 58, pm10: 88, no2: 72, so2: 20, co: 1.4, o3: 29 },
    "station-15": { pm25: 78, pm10: 120, no2: 96, so2: 30, co: 1.8, o3: 25 },
    "station-16": { pm25: 70, pm10: 105, no2: 84, so2: 28, co: 1.7, o3: 26 },
    "station-17": { pm25: 24, pm10: 38, no2: 24, so2: 9, co: 0.55, o3: 46 },
  };

  const base = stationProfiles[stationId] ?? stationProfiles["station-1"]!;

  for (let d = 0; d < days; d++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - d);
    const dateStr = date.toISOString().split("T")[0]!;

    for (let h = 0; h < 24; h += 6) {
      const variation = () => 0.7 + Math.random() * 0.6;
      const pm25 = Math.round(base.pm25 * variation() * 10) / 10;
      const pm10 = Math.round(base.pm10 * variation() * 10) / 10;
      const no2Val = Math.round(base.no2 * variation() * 10) / 10;
      const so2Val = Math.round(base.so2 * variation() * 10) / 10;
      const coVal = Math.round(base.co * variation() * 100) / 100;
      const o3Val = Math.round(base.o3 * variation() * 10) / 10;
      const aqi = Math.round(Math.max(pm25 * 2, pm10, no2Val * 1.5, o3Val * 1.2));

      results.push({
        id: `${stationId}-${dateStr}-${String(h).padStart(2, "0")}`,
        stationId,
        date: dateStr,
        time: `${String(h).padStart(2, "0")}:00`,
        airQuality: {
          pm25,
          pm10,
          no2: no2Val,
          so2: so2Val,
          co: coVal,
          o3: o3Val,
          aqi,
        },
      });
    }
  }

  return results;
}

const allMeasurements: Measurement[] = [];
const stationIds = [
  "station-1", "station-2", "station-3", "station-4",
  "station-5", "station-6", "station-7",
  "station-8", "station-9", "station-10", "station-11",
  "station-12", "station-13", "station-14", "station-15",
  "station-16", "station-17",
];

for (const id of stationIds) {
  allMeasurements.push(...generateMeasurements(id, 7));
}

export const measurements: Measurement[] = allMeasurements;
