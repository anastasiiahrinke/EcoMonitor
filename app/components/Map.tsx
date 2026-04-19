'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MonitoringStation } from '@/types'
import { getAqiLevel } from '@/lib/utils'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function createColoredIcon(aqi: number) {
  const { color } = getAqiLevel(aqi)
  return L.divIcon({
    className: '',
    html: `<div style="
      width: 24px; height: 24px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })
}

interface MapProps {
  stations: MonitoringStation[]
  selectedStationId: string | null
  onStationSelect: (id: string) => void
  stationAqiMap: Record<string, number> // { stationId: aqiValue }
}

export default function Map({ stations, selectedStationId, onStationSelect, stationAqiMap }: MapProps) {
  return (
    <MapContainer
      center={[49.0, 32.0]} // Центр України
      zoom={6}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {stations.map((station) => {
        const aqi = stationAqiMap[station.id] ?? 0
        const isSelected = selectedStationId === station.id
        return (
          <Marker
            key={station.id}
            position={[station.latitude, station.longitude]}
            icon={createColoredIcon(isSelected ? Math.max(aqi, 1) : aqi)}
            eventHandlers={{
              click: () => onStationSelect(station.id),
            }}
          >
            <Popup>
              <strong>{station.name}</strong>
              <br />
              {station.address}
              <br />
              AQI: {aqi} — {getAqiLevel(aqi).label}
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}