'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { Measurement } from '@/types'

interface Props {
  measurements: Measurement[]
}

export default function AqiLineChart({ measurements }: Props) {
  const data = measurements.map((m) => ({
    time: `${m.date} ${m.time}`,
    AQI: m.airQuality.aqi,
    PM25: m.airQuality.pm25,
    PM10: m.airQuality.pm10,
  }))

  return (
    <ResponsiveContainer width="100%" height={230}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="AQI" stroke="#8884d8" dot={false} />
        <Line type="monotone" dataKey="PM25" stroke="#82ca9d" dot={false} />
        <Line type="monotone" dataKey="PM10" stroke="#ffc658" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}