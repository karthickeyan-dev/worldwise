import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvent,
} from 'react-leaflet';

import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './Map.module.css';
import { useEffect, useState } from 'react';
import { useCities } from '../contexts/citiesContext';
import { useGeolocation } from '../hooks/UseGeoLocation';

import Button from '../components/Button';

export default function Map() {
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const {
    position: geoPosition,
    isLoading: isLoadingGeo,
    getPosition,
  } = useGeolocation();
  const { cities } = useCities();
  const [searchParams] = useSearchParams();
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  useEffect(() => {
    if (lat && lng) setMapPosition([lat, lng]);
  }, [lat, lng]);

  useEffect(() => {
    if (geoPosition) setMapPosition([geoPosition.lat, geoPosition.lng]);
  }, [geoPosition]);

  return (
    <div className={styles.mapContainer}>
      <MapContainer
        className={styles.map}
        center={mapPosition}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {cities.map(city => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangePosition position={mapPosition} />
        <HandleClick />
      </MapContainer>
      <Button type="position" onClick={getPosition}>
        {isLoadingGeo ? 'Loading...' : 'use your position'}
      </Button>
    </div>
  );
}

function ChangePosition({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function HandleClick() {
  const navigate = useNavigate();
  useMapEvent({
    click: e => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}
