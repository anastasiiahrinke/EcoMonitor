'use client'

import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { Measurement } from '@/types'

const POLLUTANT_COLORS: Record<string, string> = {
  'PM2.5': '#ff6b6b',
  'PM10': '#ffa500',
  'NO₂': '#a855f7',
  'SO₂': '#3b82f6',
  'CO': '#22c55e',
  'O₃': '#eab308',
}

interface Props {
  measurement: Measurement
}

export default function PollutantPieChart({ measurement }: Props) {
  const data = [
    { name: 'PM2.5', value: measurement.airQuality.pm25 },
    { name: 'PM10', value: measurement.airQuality.pm10 },
    { name: 'NO₂', value: measurement.airQuality.no2 },
    { name: 'SO₂', value: measurement.airQuality.so2 },
    { name: 'CO', value: measurement.airQuality.co / 10 },
    { name: 'O₃', value: measurement.airQuality.o3 },
  ].filter((d) => d.value > 0)

  return (
    <ResponsiveContainer width="100%" height={230}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={76}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={POLLUTANT_COLORS[entry.name] ?? '#ccc'} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${Number(value ?? 0).toFixed(1)} мкг/м³`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}