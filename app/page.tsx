import Link from "next/link";
import { stations } from "@/data/stations";
import { measurements } from "@/data/measurements";
import { calculateAverage, getAqiLevel } from "@/lib/utils";
import HomeMapSection from "@/app/components/HomeMapSection";

export const dynamic = "force-dynamic";

interface HomePageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { page: pageParam } = await searchParams;
  const pageSize = 9;
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

  const stationAqiMap = Object.fromEntries(
    allLatest
      .filter(({ latest }) => latest !== null)
      .map(({ station, latest }) => [station.id, latest!.airQuality.aqi])
  );

  const overallLevel = overallAvg ? getAqiLevel(overallAvg.aqi) : null;
  const totalStationPages = Math.max(1, Math.ceil(allLatest.length / pageSize));
  const currentPage = Math.min(
    totalStationPages,
    Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1)
  );
  const startIndex = (currentPage - 1) * pageSize;
  const pagedStations = allLatest.slice(startIndex, startIndex + pageSize);
  const prevPage = Math.max(1, currentPage - 1);
  const nextPage = Math.min(totalStationPages, currentPage + 1);

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
        {overallAvg && overallLevel && (
          <div className="stat-card">
            <div className="stat-value" style={{ color: overallLevel.color }}>
              {overallAvg.aqi}
            </div>
            <div className="stat-label">Середній AQI: {overallLevel.label}</div>
          </div>
        )}
      </div>

      <h2 style={{ marginBottom: "1rem" }}>Карта станцій</h2>
      <HomeMapSection
        stations={activeStations}
        stationAqiMap={stationAqiMap}
        measurements={allMeasurementsFlat}
      />

      <h2 style={{ marginBottom: "1rem" }}>Станції моніторингу</h2>
      <div className="stations-page-meta">
        <span>
          Показано {startIndex + 1}-{Math.min(startIndex + pageSize, allLatest.length)} з {allLatest.length}
        </span>
        <span>Сторінка {currentPage} з {totalStationPages}</span>
      </div>
      <div className="card-grid">
        {pagedStations.map(({ station, latest }) => {
          const aqiInfo = latest ? getAqiLevel(latest.airQuality.aqi) : null;

          return (
            <Link
              key={station.id}
              href={`/station/${station.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="card station-card">
                <span className="station-type">{station.type}</span>
                <h3>{station.name}</h3>
                <p className="station-meta">{station.address}</p>
                <p className="station-meta">
                  Координати: {station.latitude}, {station.longitude}
                </p>
                <p className="station-meta">
                  Статус: {" "}
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
      {totalStationPages > 1 && (
        <div className="pagination-row">
          <Link
            href={`/?page=${prevPage}`}
            aria-disabled={currentPage === 1}
            className={`pagination-button${currentPage === 1 ? " is-disabled" : ""}`}
          >
            Назад
          </Link>

          <div className="pagination-pages">
            {Array.from({ length: totalStationPages }, (_, index) => {
              const pageNumber = index + 1;
              return (
                <Link
                  key={pageNumber}
                  href={`/?page=${pageNumber}`}
                  className={`pagination-button${pageNumber === currentPage ? " is-active" : ""}`}
                >
                  {pageNumber}
                </Link>
              );
            })}
          </div>

          <Link
            href={`/?page=${nextPage}`}
            aria-disabled={currentPage === totalStationPages}
            className={`pagination-button${currentPage === totalStationPages ? " is-disabled" : ""}`}
          >
            Далі
          </Link>
        </div>
      )}
    </div>
  );
}