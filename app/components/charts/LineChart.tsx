'use client'

import { useState, useMemo } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { Measurement } from '@/types'

interface Props {
  measurements: Measurement[]
}

type MetricKey = 'aqi' | 'pm25' | 'pm10' | 'no2' | 'so2' | 'co' | 'o3'

const METRICS: { key: MetricKey; label: string; color: string }[] = [
  { key: 'aqi',  label: 'AQI',   color: '#79c2ff' },
  { key: 'pm25', label: 'PM2.5', color: '#82ca9d' },
  { key: 'pm10', label: 'PM10',  color: '#ffc658' },
  { key: 'no2',  label: 'NO₂',   color: '#ff7f7f' },
  { key: 'so2',  label: 'SO₂',   color: '#a4de6c' },
  { key: 'co',   label: 'CO',    color: '#d0ed57' },
  { key: 'o3',   label: 'O₃',    color: '#83a6ed' },
]

function formatTime(date: string, time: string) {
  return `${date.slice(5)} ${time.slice(0, 5)}`
}

export default function AqiLineChart({ measurements }: Props) {
  const [activeMetrics, setActiveMetrics] = useState<Set<MetricKey>>(
    new Set<MetricKey>(['aqi', 'pm25', 'pm10'])
  )

  const toggleMetric = (key: MetricKey) => {
    setActiveMetrics(prev => {
      const next = new Set(prev)
      if (next.has(key)) {
        if (next.size === 1) return prev
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const chartData = useMemo(() =>
    measurements.map(m => ({
      time: formatTime(m.date, m.time),
      aqi:  m.airQuality.aqi,
      pm25: m.airQuality.pm25,
      pm10: m.airQuality.pm10,
      no2:  m.airQuality.no2,
      so2:  m.airQuality.so2,
      co:   m.airQuality.co,
      o3:   m.airQuality.o3,
    }))
  , [measurements])

  return (
    <div className="aqi-chart-wrapper">
      <div className="aqi-metric-toggles">
        {METRICS.map(({ key, label, color }) => {
          const active = activeMetrics.has(key)
          return (
            <button
              key={key}
              onClick={() => toggleMetric(key)}
              className={`aqi-metric-btn ${active ? 'is-active' : ''}`}
              style={{ '--metric-color': color } as React.CSSProperties}
            >
              <span className="aqi-metric-dot" />
              {label}
            </button>
          )
        })}
      </div>

      <ResponsiveContainer width="100%" height={230}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(43,51,66,0.8)" />
          <XAxis
            dataKey="time"
            tick={{ fill: '#b4bfce', fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: '#2b3342' }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: '#b4bfce', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              background: '#10141b',
              border: '1px solid #2b3342',
              borderRadius: '12px',
              fontSize: '12px',
              color: '#f2f5fa',
            }}
            labelStyle={{ color: '#b4bfce', marginBottom: '4px' }}
            cursor={{ stroke: 'rgba(121,194,255,0.2)' }}
          />
          <Legend wrapperStyle={{ display: 'none' }} />
          {METRICS.map(({ key, color }) =>
            activeMetrics.has(key) ? (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={METRICS.find(m => m.key === key)?.label}
                stroke={color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            ) : null
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}