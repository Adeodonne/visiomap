import React from 'react';
import { observer } from 'mobx-react-lite';
import { APIProvider, Map, MapMouseEvent } from "@vis.gl/react-google-maps";
import Markers from './Components/Markers';
import markerStore from "../../Storages/MarkerStorage";

const MapPage = observer(() => {
    const onMapClick = (event: MapMouseEvent) => {
        const latLng = event.detail.latLng;
        if (latLng) {
            markerStore.addMarker(latLng.lat, latLng.lng);
        }
    };

    return (
        <div style={{ height: "70vh", width: "50%" }}>
            <APIProvider apiKey='AIzaSyCeKpbajvmrb-U8tPObrFOzNs-xJ7Oa7cI'>
                <Map
                    mapId='15f640d1a496947c'
                    onClick={onMapClick}
                >
                    <Markers/>
                </Map>
                <div>Deleting mark - right click</div>
                <button onClick={markerStore.removeAllMarkers}>Delete all markers</button>

            </APIProvider>
        </div>
    );
});

export default MapPage;
