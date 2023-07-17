"use client"

import L, { Layer, TileLayerOptions } from "leaflet"
import { createLayerComponent, LayerProps } from "@react-leaflet/core"
import { ReactNode } from "react"

const fvmProxy =
  process.env.NODE_ENV == "development"
    ? "http://127.0.0.1:26650/v1/query"
    : "https://fvm.tableland.network/v1/query"

interface MBTilesProps extends LayerProps {
  db: string
  children?: ReactNode
}

class MBTiles extends L.TileLayer {
  cache: Map<string, string>

  constructor(urlTemplate: string, options?: TileLayerOptions) {
    super(urlTemplate, options)
    this.cache = new Map()
  }

  createTile(coords: L.Coords, done: L.DoneCallback) {
    var tile = document.createElement("img")
    tile.alt = ""
    tile.setAttribute("role", "presentation")

    L.DomEvent.on(tile, "load", L.Util.bind(this._tileOnLoad, this, done, tile))
    L.DomEvent.on(
      tile,
      "error",
      L.Util.bind(this._tileOnError, this, done, tile)
    )

    const y = (this as any)._globalTileRange.max.y - coords.y
    const stmt = `SELECT tile_data FROM tiles WHERE tile_column = ${coords.x} AND tile_row = ${y} AND zoom_level = ${coords.z}`
    const cache = this.cache.get(stmt)
    if (cache) {
      tile.src = cache
      return tile
    }

    const xhr = new XMLHttpRequest()
    xhr.open("POST", fvmProxy, true)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.onload = (e) => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const res = JSON.parse(xhr.responseText)
          if (res && res.rows && res.rows.length === 1) {
            tile.src = URL.createObjectURL(
              new Blob([Uint8Array.from(res.rows[0][0])], { type: "image/png" })
            )
            this.cache.set(stmt, tile.src)
          }
        } else {
          console.error(xhr.statusText)
        }
      }
    }
    xhr.onerror = (e) => {
      console.error(xhr.statusText)
    }

    const req = {
      stmt: stmt,
    }
    xhr.send(JSON.stringify(req))

    return tile
  }

  getAttribution() {
    return "<a href='https://tableland.xyz'>Tableland</a>"
  }
}

const createMBTilesLayer = (props: MBTilesProps, context: any) => {
  const instance = new MBTiles("placeholder", { ...props })
  return { instance, context }
}

const updateMBTilesLayer = (
  _instance: Layer,
  _props: MBTilesProps,
  _prevProps: MBTilesProps
) => {
  // no op
}

const MBTilesLayer = createLayerComponent(
  createMBTilesLayer,
  updateMBTilesLayer
)
export default MBTilesLayer
