'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import { getAqiLevel } from '@/lib/utils'

interface StationBar {
  name: string
  aqi: number
}

interface Props {
  data: StationBar[]
}

export default function StationsBarChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical"> 
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" domain={[0, 300]} />
        <YAxis type="category" dataKey="name" width={120} />
        <Tooltip />
        <Bar dataKey="aqi" name="AQI">
          {data.map((entry, index) => (
            <Cell key={index} fill={getAqiLevel(entry.aqi).color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}