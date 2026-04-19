'use client'

import dynamicImport from 'next/dynamic'
import { useState } from 'react'
import { Measurement, MonitoringStation } from '@/types'
import PollutantPieChart from '@/app/components/charts/PieChart'
import AqiLineChart from '@/app/components/charts/LineChart'
import PollutantsBarChart from '@/app/components/charts/PollutantsBarChart'

const Map = dynamicImport(() => import('@/app/components/Map'), {
  ssr: false,
  loading: () => <div className="map-loading">Завантаження карти...</div>,
})

interface Props {
  stations: MonitoringStation[]
  stationAqiMap: Record<string, number>
  measurements: Measurement[]
}

export default function HomeMapSection({ stations, stationAqiMap, measurements }: Props) {
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null)
  const selectedStation = stations.find((station) => station.id === selectedStationId) ?? null
  const selectedMeasurements = selectedStationId
    ? measurements
        .filter((measurement) => measurement.stationId === selectedStationId)
        .sort((a, b) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`))
    : []
  const latestMeasurement = selectedMeasurements[0] ?? null
  const recentMeasurements = selectedMeasurements.slice(0, 10)

  return (
    <div className="dashboard-stack">
      <div className="dashboard-shell">
        <div className="dashboard-map-card">
          <Map
            stations={stations}
            selectedStationId={selectedStationId}
            onStationSelect={setSelectedStationId}
            stationAqiMap={stationAqiMap}
          />
        </div>

        <div className="dashboard-charts-card">
          {!selectedStation || !latestMeasurement ? (
            <div className="empty-charts-state">
              <div className="empty-charts-title">Треба клікнути по точці на мапі</div>
              <div className="empty-charts-text">
                Після вибору станції тут з’являться графіки з актуальними показниками та динамікою AQI.
              </div>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <div className="section-kicker">Вибрана станція</div>
                <h3 style={{ marginTop: '0.35rem' }}>{selectedStation.name}</h3>
                <p className="station-meta" style={{ marginTop: '0.35rem' }}>
                  {selectedStation.address} • Останнє вимірювання: {latestMeasurement.date} {latestMeasurement.time}
                </p>
              </div>

              <div className="chart-stack-top">
                <div className="chart-card chart-card-small">
                  <h4 className="chart-title">Розподіл показників</h4>
                  <PollutantPieChart measurement={latestMeasurement} />
                </div>

                <div className="chart-card chart-card-small">
                  <h4 className="chart-title">AQI та PM у часі</h4>
                  <AqiLineChart measurements={recentMeasurements} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="dashboard-bar-card">
        {!selectedStation || !latestMeasurement ? (
          <div className="empty-charts-state empty-charts-state-bar">
            <div className="empty-charts-title">Забруднювачі в останньому замірі</div>
            <div className="empty-charts-text">
              Спочатку клікни по точці на мапі, щоб побачити окремий графік забруднювачів під основним блоком.
            </div>
          </div>
        ) : (
          <>
            <div className="section-kicker">Окремий блок</div>
            <h4 className="chart-title" style={{ marginTop: '0.5rem' }}>Забруднювачі в останньому замірі</h4>
            <PollutantsBarChart measurement={latestMeasurement} />
          </>
        )}
      </div>
    </div>
  )
}