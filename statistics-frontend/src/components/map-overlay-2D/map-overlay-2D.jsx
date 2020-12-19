import React, { memo, useRef } from "react";
import "leaflet/dist/leaflet.css";
import "./map-overlay.scss";
import * as ReactLeaflet from "react-leaflet";
import { useLeaflet } from "react-leaflet";
import MapLegend from "../map-legend/map-legend";
import MapInfoControl from "../map-info-control/map-info-control";
import MapSideBar from "./map-side-bar";
import ResetViewMapButton from "../reset-view-map-button/reset-view-map-button";
import { useMapStatistics } from "../../hooks/use-map-statistics";
import GeoJson from "../geoJson/geojson";
import { useUiContext } from "../../hooks/useUiContext";
import { setSwipe, setTheme } from "../../context/ui-actions";

const { Map, TileLayer } = ReactLeaflet;

function MapOverlay2D() {
  const { map } = useLeaflet();
  const geoJsonRef = useRef(null);
  const infoControlRef = useRef(null);
  const {
    geoJsonFromSelectedStatistic,
    selectedStatistic,
    allMapStatistics,
    setSelectedStatistic,
    fetchMapStatisticsById,
  } = useMapStatistics(geoJsonRef);
  const {
    state: { theme },
    dispatch,
  } = useUiContext();

  function centerMapView(e) {
    if (e) {
      map.panTo(e.popup._latlng, { animate: true });
    }
  }

  return (
    <Map
      center={[45.0, 10.0]}
      zoom={3}
      tap={false} // disable tap events to let leaflet assume all map touch events are clean mouse events
      onPopupopen={centerMapView.bind(this)}
      zoomControl={false}
      onMovestart={() => dispatch(setSwipe(false))}
      onMoveend={() => dispatch(setSwipe(true))}
      minZoom={3}
      bounceAtZoomLimits={true}
      maxBoundsViscosity={0.95}
      maxBounds={[
        [-90, -175],
        [80, 175],
      ]}
    >
      <TileLayer
        noWrap={true}
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> | &amp;copy <a href="https://apps.mapbox.com/feedback/">Mapbox</a>'
        url={`https://api.mapbox.com/styles/v1/mapbox/${theme}-v10/tiles/{z}/{x}/{y}?access_token=${process.env.REACT_APP_MAPBOX_KEY}`}
      />
      <MapSideBar
        mapStatistics={allMapStatistics}
        toggleMapMode={() =>
          dispatch(setTheme(theme === "light" ? "dark" : "light"))
        }
        mapMode={theme}
        setSelectedStatistic={setSelectedStatistic}
        fetchMapStatisticsById={fetchMapStatisticsById}
        selectedStatistic={selectedStatistic}
      />
      {selectedStatistic && geoJsonFromSelectedStatistic.description && (
        <>
          <GeoJson
            geoJsonRef={geoJsonRef}
            data={geoJsonFromSelectedStatistic}
            infoControlRef={infoControlRef}
          />
          <MapInfoControl
            selectedStatisticMetaData={geoJsonFromSelectedStatistic}
            ref={infoControlRef}
          />
          <MapLegend selectedStatisticMetaData={geoJsonFromSelectedStatistic} />
        </>
      )}
      <ResetViewMapButton />
    </Map>
  );
}

export default memo(MapOverlay2D);