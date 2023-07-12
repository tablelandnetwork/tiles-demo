"use client"

import { useState } from "react"
import { LatLngLiteral, LatLngExpression } from "leaflet"
import { MapContainer, TileLayer, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import MBTilesLayer from "./MBTilesLayer"

export function ChangeView(coords: LatLngLiteral) {
  const map = useMap()
  map.setView(coords, 6)
  return null
}
export default function Map() {
  const [geoData, setGeoData] = useState({ lat: 38.938611, lng: -119.966794 })

  return (
    <MapContainer center={geoData} zoom={1} style={{ height: "100vh" }}>
      <MBTilesLayer db="countries" />
      <ChangeView lat={geoData.lat} lng={geoData.lng} />
    </MapContainer>
  )
}
