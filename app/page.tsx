import Link from "next/link";
import { stations } from "@/data/stations";
import { measurements } from "@/data/measurements";
import { calculateAverage, getAqiLevel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const activeStations = stations.filter((s) => s.active);
  const totalMeasurements = measurements.length;

  const allLatest = activeStations.map((station) => {
    const stationM = measurements
      .filter((m) => m.stationId === station.id)
      .sort((a, b) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`));
    return { station, latest: stationM[0] ?? null };
  });

  const allMeasurementsFlat = measurements.filter((m) =>
    activeStations.some((s) => s.id === m.stationId)
  );
  const overallAvg = calculateAverage(allMeasurementsFlat);

  return (
    <div className="container">
      <h1 className="page-title">Моніторинг якості повітря</h1>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{stations.length}</div>
          <div className="stat-label">Всього станцій</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{activeStations.length}</div>
          <div className="stat-label">Активних</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalMeasurements}</div>
          <div className="stat-label">Вимірювань</div>
        </div>
        {overallAvg && (
          <div className="stat-card">
            <div className="stat-value">{overallAvg.aqi}</div>
            <div className="stat-label">Середній AQI</div>
          </div>
        )}
      </div>

      <h2 style={{ marginBottom: "1rem" }}>Станції моніторингу</h2>
      <div className="card-grid">
        {allLatest.map(({ station, latest }) => {
          const aqiInfo = latest ? getAqiLevel(latest.airQuality.aqi) : null;
          return (
            <Link key={station.id} href={`/station/${station.id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div className="card station-card">
                <span className="station-type">{station.type}</span>
                <h3>{station.name}</h3>
                <p className="station-meta">{station.address}</p>
                <p className="station-meta">
                  Координати: {station.latitude}, {station.longitude}
                </p>
                <p className="station-meta">
                  Статус:{" "}
                  <span className={station.active ? "status-active" : "status-inactive"}>
                    {station.active ? "Активна" : "Неактивна"}
                  </span>
                </p>
                {latest && aqiInfo && (
                  <div style={{ marginTop: "0.75rem" }}>
                    <span className="aqi-badge" style={{ background: aqiInfo.color }}>
                      AQI: {latest.airQuality.aqi} — {aqiInfo.label}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
