import React, { useState, useEffect, useRef } from "react";

const RidingLiveTracking = () => {
  const [isMapReady, setIsMapReady] = useState(false);
  const [currentPosition, setCurrentPosition] = useState({
    lat: 28.7041,
    lng: 77.1025,
  });
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve(script);
        script.onerror = () =>
          reject(new Error(`Script load error for ${src}`));
        document.head.appendChild(script);
      });
    };

    const loadHereMapsScripts = async () => {
      try {
        await loadScript("https://js.api.here.com/v3/3.1/mapsjs-core.js");
        await loadScript("https://js.api.here.com/v3/3.1/mapsjs-service.js");
        await loadScript("https://js.api.here.com/v3/3.1/mapsjs-ui.js");
        await loadScript("https://js.api.here.com/v3/3.1/mapsjs-mapevents.js");
        setIsMapReady(true);
      } catch (error) {
        console.error("Error loading HERE Maps scripts:", error);
      }
    };

    loadHereMapsScripts();
  }, []);

  useEffect(() => {
    if (!isMapReady || !mapRef.current) return;

    const platform = new H.service.Platform({
      apikey: "OAsu6gwJ63V8QdSQRgourqpzd7x4ZXWJkvqiyUpjd_4",
    });

    const defaultLayers = platform.createDefaultLayers();

    const map = new H.Map(mapRef.current, defaultLayers.vector.normal.map, {
      center: currentPosition,
      zoom: 15,
      pixelRatio: window.devicePixelRatio || 1,
    });

    mapInstanceRef.current = map;

    // Add map interactions without UI controls
    new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

    // Add marker for live tracking
    const marker = new H.map.Marker(currentPosition);
    map.addObject(marker);
    markerRef.current = marker;

    // Geolocation tracking
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPosition = { lat: latitude, lng: longitude };

        setCurrentPosition(newPosition);

        // Update marker position and recenter the map
        const geoPoint = new H.geo.Point(latitude, longitude);
        marker.setGeometry(geoPoint);
        map.setCenter(geoPoint);
      },
      (error) => console.error("Geolocation error:", error),
      { enableHighAccuracy: true }
    );

    window.addEventListener("resize", () => map.getViewPort().resize());

    return () => {
      navigator.geolocation.clearWatch(watchId);
      window.removeEventListener("resize", () => map.getViewPort().resize());
      if (map) map.dispose();
    };
  }, [isMapReady]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "50vh",
      }}
    />
  );
};

export default RidingLiveTracking;
