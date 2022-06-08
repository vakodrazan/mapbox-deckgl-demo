import { useState } from 'react';
import { Map } from 'react-map-gl';
import transformScale from '@turf/transform-scale';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer, SolidPolygonLayer, PolygonLayer } from '@deck.gl/layers';
import { Box } from '@mui/system';
import area from '@turf/area';
import { PathStyleExtension } from '@deck.gl/extensions';
import {
  _SunLight as SunLight,
  AmbientLight,
  LightingEffect,
} from '@deck.gl/core';
import BuildingOptions from './Components/BuildingOptions';
import Statistics from './Components/Statistics';

// TODO: Put MAPBOX_ACCESS_TOKEN to .env
const MAPBOX_ACCESS_TOKEN =
  'pk.eyJ1IjoieWVzdHVyIiwiYSI6ImNsMnp2dWltcjBnNGozY3FvZTI0eDJ2NDAifQ.pNemj6DI2TOpOABVjDj_sQ';
const initialGeojson = {
  type: 'MultiPolygon',
  coordinates: [
    [
      [
        [6.82386387, 46.469095495],
        [6.823902186, 46.46908068],
        [6.824159079, 46.468999131],
        [6.824338894, 46.468997858],
        [6.82449149, 46.468974396],
        [6.824593806, 46.468964515],
        [6.824831947, 46.469261771],
        [6.825033759, 46.469513579],
        [6.824634938, 46.469481552],
        [6.824622278, 46.469518637],
        [6.824061917, 46.469483483],
        [6.823815628, 46.469468113],
        [6.82386387, 46.469095495],
      ],
    ],
  ],
};

const sun = new SunLight({
  timestamp: 1659963737000,
  color: [255, 255, 255],
  intensity: 1,
});
const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0,
});
const lightingEffect = new LightingEffect({ sun, ambientLight });

function Root() {
  const [geoJsonFile, setGeoJsonFile] = useState('');

  const [floorNumber, setFloorNumber] = useState(7);
  const [lotCoverage, setLotCoverage] = useState(0.5);
  const [floorHeight, setFloorHeight] = useState(6);
  const [baseFloorHeight, setBaseFloorHeight] = useState(10);

  const geojson = geoJsonFile ? JSON.parse(geoJsonFile) : initialGeojson;
  const coordinate = geojson?.coordinates[0][0][0];

  const INITIAL_VIEW_STATE = {
    latitude: coordinate[1],
    longitude: coordinate[0],
    zoom: 18,
    bearing: 0,
    pitch: 70,
  };

  const lotAreaLayer = new GeoJsonLayer({
    id: 'geojson-layer',
    data: geojson,
    pickable: true,
    stroked: false,
    filled: true,
    extruded: true,
    getFillColor: () => [230, 255, 250, 255],
    getElevation: () => 0,
  });

  const outlinePolyPoints = geojson.coordinates[0];
  const outlinelayer = new PolygonLayer({
    id: 'outline-layer',
    data: [{ contour: outlinePolyPoints }],
    getDashArray:() => [14, 4],
    getLineColor: () => [155, 155, 155],
    getLineWidth: () => 0.2,
    dashJustified: true,
    filled: false,
    getPolygon: (d: any) => {
      return d.contour;
    },
    dashGapPickable: true,
    extensions: [new PathStyleExtension({ dash: true })],
  });

  const scaledPoly = transformScale(geojson, lotCoverage);

  const floorLayers = [...Array(floorNumber + 1)].map((_, index) => {
    const isZeroFloor = index === 0;

    const localFloorHeight = isZeroFloor ? baseFloorHeight : floorHeight;

    const zOffset =
      index * localFloorHeight +
      index / 5 +
      (isZeroFloor ? 0 : baseFloorHeight - floorHeight);

    const [pointsToOffset] = scaledPoly.coordinates;
    const polyPoints = pointsToOffset[0];
    const polyPointsWithZOffset = polyPoints.map((ar: string[]) => [
      ...ar,
      zOffset,
    ]);

    const polData = [
      { polygon: polyPointsWithZOffset }, // Simple polygon (array of coords)
    ];

    const color = Boolean(index % 2) ? 180 : 200;
    const colorRGB = isZeroFloor
      ? [color + 55, color + 55, color - 55, 255]
      : [color, color + 55, color, 255];
    const buildingFloorLayer = new SolidPolygonLayer({
      getFillColor: () => colorRGB,
      data: polData,
      getPolygon: (d: any) => d.polygon,
      getColor: () => [255, 0, 0],
      extruded: true,
      getElevation: () => localFloorHeight,
    });
    return buildingFloorLayer;
  });

  const layers = [lotAreaLayer, outlinelayer, [...floorLayers]];

  const lotArea = area(geojson);
  const buildingArea = area(scaledPoly);

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={layers}
      effects={[lightingEffect]}
    >
      <Map
        mapStyle={'mapbox://styles/mapbox/streets-v11'}
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <BuildingOptions
          lotCoverage={lotCoverage}
          floorNumber={floorNumber}
          floorHeight={floorHeight}
          baseFloorHeight={baseFloorHeight}
          setGeoJsonFile={setGeoJsonFile}
          setLotCoverage={setLotCoverage}
          setFloorNumber={setFloorNumber}
          setFloorHeight={setFloorHeight}
          setBaseFloorHeight={setBaseFloorHeight}
        />
        <Statistics
          lotArea={lotArea}
          floorHeight={floorHeight}
          floorNumber={floorNumber}
          baseFloorHeight={baseFloorHeight}
          buildingArea={buildingArea}
        />
      </Box>
    </DeckGL>
  );
}

export default Root;
