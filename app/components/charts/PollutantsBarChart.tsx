'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Measurement } from '@/types'

interface Props {
  measurement: Measurement
}

const BAR_COLORS = ['#79c2ff', '#5fb6ff', '#7cdbff', '#62d0c9', '#74d67d', '#f3b45e']

export default function PollutantsBarChart({ measurement }: Props) {
  const data = [
    { name: 'PM2.5', value: measurement.airQuality.pm25 },
    { name: 'PM10', value: measurement.airQuality.pm10 },
    { name: 'NO₂', value: measurement.airQuality.no2 },
    { name: 'SO₂', value: measurement.airQuality.so2 },
    { name: 'CO', value: Number((measurement.airQuality.co / 10).toFixed(1)) },
    { name: 'O₃', value: measurement.airQuality.o3 },
  ]

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
        <XAxis dataKey="name" tick={{ fill: '#b4bfce', fontSize: 12 }} />
        <YAxis tick={{ fill: '#b4bfce', fontSize: 12 }} />
        <Tooltip
          cursor={{ fill: 'rgba(121, 194, 255, 0.08)' }}
          formatter={(value) => `${Number(value ?? 0).toFixed(1)} мкг/м³`}
        />
        <Bar dataKey="value" name="Значення" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={BAR_COLORS[index % BAR_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}