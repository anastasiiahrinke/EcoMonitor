import { AirQualityData, Measurement } from "@/types";

export function getAqiLevel(aqi: number): { label: string; color: string } {
  if (aqi <= 50) return { label: "Добре", color: "#4caf50" };
  if (aqi <= 100) return { label: "Помірно", color: "#c5b30c" };
  if (aqi <= 150) return { label: "Шкідливо для чутливих", color: "#d66407" };
  if (aqi <= 200) return { label: "Шкідливо", color: "#f44336" };
  return { label: "Дуже шкідливо", color: "#9c27b0" };
}

export function calculateAverage(measurements: Measurement[]): AirQualityData | null {
  if (measurements.length === 0) return null;
  const sum = measurements.reduce(
    (acc, m) => ({
      pm25: acc.pm25 + m.airQuality.pm25,
      pm10: acc.pm10 + m.airQuality.pm10,
      no2: acc.no2 + m.airQuality.no2,
      so2: acc.so2 + m.airQuality.so2,
      co: acc.co + m.airQuality.co,
      o3: acc.o3 + m.airQuality.o3,
      aqi: acc.aqi + m.airQuality.aqi,
    }),
    { pm25: 0, pm10: 0, no2: 0, so2: 0, co: 0, o3: 0, aqi: 0 }
  );
  const n = measurements.length;
  return {
    pm25: Math.round((sum.pm25 / n) * 10) / 10,
    pm10: Math.round((sum.pm10 / n) * 10) / 10,
    no2: Math.round((sum.no2 / n) * 10) / 10,
    so2: Math.round((sum.so2 / n) * 10) / 10,
    co: Math.round((sum.co / n) * 100) / 100,
    o3: Math.round((sum.o3 / n) * 10) / 10,
    aqi: Math.round(sum.aqi / n),
  };
}
