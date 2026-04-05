import Link from "next/link";
import { notFound } from "next/navigation";
import { stations } from "@/data/stations";
import { measurements } from "@/data/measurements";
import { calculateAverage, getAqiLevel } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface StationPageProps {
  params: Promise<{ id: string }>;
}

export default async function StationPage({ params }: StationPageProps) {
  const { id } = await params;
  const station = stations.find((s) => s.id === id);

  if (!station) {
    notFound();
  }

  const stationMeasurements = measurements
    .filter((m) => m.stationId === id)
    .sort((a, b) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`));

  const latest = stationMeasurements[0];
  const avg = calculateAverage(stationMeasurements);

  const recentMeasurements = stationMeasurements.slice(0, 10);

  const barData = avg
    ? [
        { label: "PM2.5", value: avg.pm25, max: 100 },
        { label: "PM10", value: avg.pm10, max: 150 },
        { label: "NO₂", value: avg.no2, max: 100 },
        { label: "SO₂", value: avg.so2, max: 50 },
        { label: "O₃", value: avg.o3, max: 100 },
      ]
    : [];

  return (
    <div className="container">
      <Link href="/" className="back-link">← Назад до списку</Link>

      <h1 className="page-title">{station.name}</h1>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <p><strong>Адреса:</strong> {station.address}</p>
        <p><strong>Тип:</strong> <span className="station-type">{station.type}</span></p>
        <p><strong>Координати:</strong> {station.latitude}, {station.longitude}</p>
        <p>
          <strong>Статус:</strong>{" "}
          <span className={station.active ? "status-active" : "status-inactive"}>
            {station.active ? "Активна" : "Неактивна"}
          </span>
        </p>
      </div>

      {latest && (
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h3>Останнє вимірювання ({latest.date} {latest.time})</h3>
          <div style={{ marginTop: "0.5rem" }}>
            <span
              className="aqi-badge"
              style={{ background: getAqiLevel(latest.airQuality.aqi).color }}
            >
              AQI: {latest.airQuality.aqi} — {getAqiLevel(latest.airQuality.aqi).label}
            </span>
          </div>
          <div className="stats-row" style={{ marginTop: "1rem" }}>
            <div className="stat-card">
              <div className="stat-value">{latest.airQuality.pm25}</div>
              <div className="stat-label">PM2.5 (мкг/м³)</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{latest.airQuality.pm10}</div>
              <div className="stat-label">PM10 (мкг/м³)</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{latest.airQuality.no2}</div>
              <div className="stat-label">NO₂ (мкг/м³)</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{latest.airQuality.so2}</div>
              <div className="stat-label">SO₂ (мкг/м³)</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{latest.airQuality.co}</div>
              <div className="stat-label">CO (мг/м³)</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{latest.airQuality.o3}</div>
              <div className="stat-label">O₃ (мкг/м³)</div>
            </div>
          </div>
        </div>
      )}

      {barData.length > 0 && (
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h3>Середні показники (графік)</h3>
          <div className="bar-chart">
            {barData.map((d) => (
              <div key={d.label} className="bar-item">
                <span className="bar-value">{d.value}</span>
                <div
                  className="bar"
                  style={{ height: `${Math.min((d.value / d.max) * 160, 160)}px` }}
                />
                <span className="bar-label">{d.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h3>Останні вимірювання</h3>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table" style={{ marginTop: "0.75rem" }}>
            <thead>
              <tr>
                <th>Дата</th>
                <th>Час</th>
                <th>AQI</th>
                <th>PM2.5</th>
                <th>PM10</th>
                <th>NO₂</th>
                <th>SO₂</th>
                <th>CO</th>
                <th>O₃</th>
              </tr>
            </thead>
            <tbody>
              {recentMeasurements.map((m) => (
                <tr key={m.id}>
                  <td>{m.date}</td>
                  <td>{m.time}</td>
                  <td>
                    <span
                      className="aqi-badge"
                      style={{ background: getAqiLevel(m.airQuality.aqi).color, fontSize: "0.75rem" }}
                    >
                      {m.airQuality.aqi}
                    </span>
                  </td>
                  <td>{m.airQuality.pm25}</td>
                  <td>{m.airQuality.pm10}</td>
                  <td>{m.airQuality.no2}</td>
                  <td>{m.airQuality.so2}</td>
                  <td>{m.airQuality.co}</td>
                  <td>{m.airQuality.o3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
