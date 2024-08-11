import { useEffect, useRef } from 'react';
import { useMap } from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Marker } from "@googlemaps/markerclusterer";
import { observer } from 'mobx-react-lite';
import markerStore from "../../../Storages/MarkerStorage";

const Markers = observer(() => {
    const map = useMap();
    const clusterer = useRef<MarkerClusterer | null>(null);
    const markersRef = useRef<{ [key: string]: Marker }>({});

    useEffect(() => {
        if (!map) return;

        if (!clusterer.current) {
            clusterer.current = new MarkerClusterer({ map });
        } else {
            clusterer.current.clearMarkers();
        }

        const newMarkers = markerStore.getMarkers.map((point) => {
            const marker = new google.maps.Marker({
                position: point,
                label: point.id.toString(),
                map,
            });

            marker.addListener('rightclick', () => {
                markerStore.removeMarker(point.id);
            });

            markersRef.current[point.id] = marker;
            return marker;
        });

        if (clusterer.current) {
            clusterer.current.addMarkers(newMarkers);
        }

        return () => {
            newMarkers.forEach(marker => marker.setMap(null));
        };
    }, [map, markerStore.getMarkers]);

    return null;
});

export default Markers;
