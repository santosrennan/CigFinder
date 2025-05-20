import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api'
import { useGoogleMaps } from '../hooks/useGoogleMaps'
import { usePlaces } from '../hooks/usePlaces'
import { useFiltersCompat } from '../store/filterStore'
import MapApiHelp from './MapApiHelp'
import EmptyState from './EmptyState'
import { Button } from './ui/button'
import type { Place } from '../types'

interface MapViewProps {
  onPlaceSelect?: (place: Place) => void
}

const containerStyle = {
  width: '100%',
  height: '100%',
}

export default function MapView({ onPlaceSelect }: MapViewProps) {
  const { isLoaded, loadError, errorDetails } = useGoogleMaps()
  const { data = [] } = usePlaces()
  const { filters, clearFilters, applyFilters } = useFiltersCompat()

  // Qual place está com hover
  const [hoveredPlace, setHoveredPlace] = useState<Place | null>(null)

  /* anti-flicker */
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [lock, setLock] = useState(false)

  const show = useCallback((p: Place) => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current)
      hideTimer.current = null
    }
    setHoveredPlace(p)
  }, [])

  const hide = useCallback(() => {
    if (lock) return
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => {
      if (!lock) setHoveredPlace(null)
    }, 300)
  }, [lock])

  const [mapError, setMapError] = useState<string | null>(null)
  const [showMapHelp, setShowMapHelp] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const mapRef = useRef<google.maps.Map | null>(null)

  const filteredData = applyFilters(data)
  const hasActiveFilters =
    filters.brands.length > 0 ||
    filters.accessories.length > 0 ||
    filters.openNow ||
    filters.nearMe

  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
        { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
      ],
    }),
    []
  )

  // Detecta erro no carregamento do Maps
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loadError || document.querySelector('.gm-err-container')) {
        console.error('Google Maps error:', loadError)
        setShowMapHelp(true)
      }
    }, 2000)
    return () => clearTimeout(timer)
  }, [isLoaded, loadError, errorDetails])

  // Pega localização do usuário se “nearMe” ativado
  useEffect(() => {
    if (!filters.nearMe && !userLocation) return
    navigator.geolocation?.getCurrentPosition(
      pos => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {}
    )
  }, [filters.nearMe, userLocation])

  const handleMarkerClick = useCallback(
    (place: Place) => onPlaceSelect?.(place),
    [onPlaceSelect]
  )

  const handleMapLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map
      map.set('styles', mapOptions.styles)
      try {
        if (filteredData.length) {
          const bounds = new google.maps.LatLngBounds()
          filteredData.forEach(p => bounds.extend({ lat: p.latitude, lng: p.longitude }))
          if (userLocation) bounds.extend(userLocation)
          map.fitBounds(bounds)
          if (filteredData.length === 1) map.setZoom(15)
        } else if (userLocation) {
          map.setCenter(userLocation)
          map.setZoom(14)
        }
      } catch (e) {
        setMapError(`Erro ao configurar o mapa: ${(e as Error).message}`)
      }
    },
    [filteredData, userLocation, mapOptions.styles]
  )

  // Renders de loading / error / empty
  if (showMapHelp) {
    return <MapApiHelp apiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY || ''} errorDetails={errorDetails || undefined} />
  }
  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin" />
          <p className="mt-3 text-gray-700 dark:text-gray-300">Carregando mapa...</p>
        </div>
      </div>
    )
  }
  if (mapError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="max-w-md p-6 bg-white dark:bg-gray-700 rounded-lg shadow-lg text-center">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2 dark:text-white">Erro no Google Maps</h2>
          <p className="text-gray-600 dark:text-gray-300">{mapError}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-brand hover:bg-brand-light text-white rounded">
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }
  if (!filteredData.length && hasActiveFilters) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <EmptyState
          title="Nenhum local encontrado"
          message="Não encontramos estabelecimentos que correspondam aos filtros selecionados."
          action={<Button onClick={clearFilters} variant="outline" size="sm">Limpar filtros</Button>}
        />
      </div>
    )
  }

  const defaultCenter = { lat: -22.9068, lng: -43.1729 }
  const initialCenter = userLocation || defaultCenter

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={initialCenter}
      zoom={12}
      options={mapOptions}
      onLoad={handleMapLoad}
    >
      {userLocation && (
        <Marker
          position={userLocation}
          icon={{
            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            scaledSize: new google.maps.Size(32, 32),
          }}
          title="Sua localização"
        />
      )}

      {filteredData.map(place => (
        <Marker
          key={place.place_id}
          position={{ lat: place.latitude, lng: place.longitude }}
          onClick={() => handleMarkerClick(place)} // abre modal
          onMouseOver={() => show(place)}          // mostra tooltip
          onMouseOut={hide}                        // esconde tooltip
          icon={{
            url: place.open_status === 'OPEN'
              ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
              : 'https://maps.google.com/mapfiles/ms/icons/gray-dot.png',
            scaledSize: new google.maps.Size(32, 32),
          }}
          animation={google.maps.Animation.DROP}
        />
      ))}

      {hoveredPlace && (
        <InfoWindow
          position={{ lat: hoveredPlace.latitude, lng: hoveredPlace.longitude }}
          options={{ pixelOffset: new google.maps.Size(0, -10) }}
          onCloseClick={() => setHoveredPlace(null)}
          onDomReady={() => {
            // força o container nativo a aceitar pointer events
            const wrapper = document.querySelector('.gm-style-iw')
            if (wrapper) (wrapper as HTMLElement).style.pointerEvents = 'auto'
          }}
        >
          <div
            // aqui habilitamos os eventos de pointer no seu próprio div
            className="glass-effect relative rounded-lg px-3 py-2 shadow-lg pointer-events-auto cursor-default"
            onMouseEnter={() => setLock(true)}
            onMouseLeave={() => {
              setLock(false)
              hide()
            }}
          >
            <p className="font-semibold mb-1 text-gray-100">{hoveredPlace.name}</p>
            <div className="flex items-center text-xs text-gray-200">
              <span className="flex items-center mr-3">⭐ {hoveredPlace.google_rating}</span>
              <span className="flex items-center">🚬 {hoveredPlace.cig_rating}</span>
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  )
}
