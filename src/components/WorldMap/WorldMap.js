import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "./WorldMap.scss";
import "mapbox-gl/dist/mapbox-gl.css";
import useSWR from "swr";
mapboxgl.accessToken =
    "pk.eyJ1IjoiZ3poMTIiLCJhIjoiY2s5ZXdjYnFoMDZ2NTNrbzJoNDkwbWlobCJ9.rgRhGIRKnj2YIWrOr4v4MQ";

export default function WorldMap() {
    const fetcher = (url) =>
        fetch(url)
            .then((data) => data.json())
            .then((data) =>
                data.map((point, index) => ({
                    type: "Feature",
                    properties: {
                        id: index,
                        country: point.country,
                        province: point.province,
                        confirmed: point.stats.confirmed,
                        deaths: point.stats.deaths,
                        recovered: point.stats.recovered,
                    },
                    geometry: {
                        type: "Point",
                        coordinates: [
                            point.coordinates.longitude,
                            point.coordinates.latitude,
                        ],
                    },
                }))
            );
    const mapboxElRef = useRef(null);
    const { data } = useSWR("https://disease.sh/v2/jhucsse", fetcher);
    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapboxElRef.current,
            style: "mapbox://styles/mapbox/dark-v10",
            center: [-10, 40],
            width: "100vw",
            height: "100vh",
            zoom: 2.5,
            minZoom: 2,
            maxZoom: 8,
        });
        map.addControl(new mapboxgl.NavigationControl());
        map.once("load", function () {
            map.addSource("points", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: data,
                },
            });
            map.addLayer({
                id: "circles",
                source: "points",
                type: "circle",
                paint: {
                    "circle-opacity": 0.8,
                    "circle-stroke-width": 1,
                    "circle-stroke-color": "white",
                    "circle-radius": [
                        "interpolate",
                        ["linear"],
                        ["get", "confirmed"],
                        1,
                        3,
                        1000,
                        6,
                        3500,
                        10,
                        7000,
                        16,
                        12000,
                        22,
                        100000,
                        50,
                    ],
                    "circle-color": [
                        "interpolate",
                        ["linear"],
                        ["get", "confirmed"],
                        1,
                        "#f0fff1",
                        5000,
                        "#c2f8cb",
                        10000,
                        "#b3e9c7",
                        25000,
                        "#8367c7",
                        50000,
                        "#5603ad",
                        75000,
                        "#2d075a",
                    ],
                },
            });
        });
        const info = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
        });

        let lastId;

        map.on("mousemove", "circles", (e) => {
            map.getCanvas().style.cursor = "pointer";
            const id = e.features[0].properties.id;

            if (id !== lastId) {
                lastId = id;
                const {
                    country,
                    province,
                    confirmed,
                    deaths,
                    recovered,
                } = e.features[0].properties;
                const coordinates = e.features[0].geometry.coordinates.slice();
                const provincetext = province === "null" ? "" : `<p>${province}, `;
                const HTML = `
          <p><b>${provincetext}</b><b> ${country}</b></p>
          <p>Number of Confirmed Cases: ${confirmed}</p>
          <p>Number of Deaths: ${deaths}</p>
          <p>Number of People Recovered: ${recovered}`;
                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }
                info.setLngLat(coordinates).setHTML(HTML).addTo(map);
            }
        });

        map.on("mouseleave", "circles", function () {
            lastId = undefined;
            map.getCanvas().style.cursor = "";
            info.remove();
        });
    }, [data]);
    return (
        <div className="WorldMap">
            <div className="mapContainer">
                <div className="mapBox" ref={mapboxElRef} />
            </div>
        </div>
    );
}