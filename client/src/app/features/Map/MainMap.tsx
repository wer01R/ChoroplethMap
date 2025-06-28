import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl, { Map as MapBoxMap, MapMouseEvent, MapMouseEventType, Popup } from 'mapbox-gl'
import { useEffect, useMemo, useRef, useState } from 'react';
import { GeoJSONFeatureCollection, statData } from '../../../lib/types';
import { FeatureCollection, GeoJSON, GeoJsonProperties, Geometry, MultiPolygon } from 'geojson';
import _, { map } from 'lodash'
import agent from '../../../lib/api/agent';
import { useAppDispatch, useAppSelector } from '../../../lib/store/hooks';
import { setNum } from '../../../lib/store/notes';
import { geoToName, getIntersection, nameToGeo, nameToStat, provinceNames, statToName } from '../../../lib/util/util';
import center from '@turf/center';
import createReactPopup from '../../../lib/util/createReactPopup';
import StatToolkits from '../../shared/component/StatToolkits';
import bbox from '@turf/bbox';
import { setMapFlyto, setMapGeoJson } from '../../../lib/store/setMap';

export default function MainMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState<Boolean>(false);
  const mapRef = useRef<MapBoxMap>(null);
  const isReturningRef = useRef(false);
  const geojson = useAppSelector(state => state.setMap.geoJson);
  const notes = useAppSelector(state => state.notes);
  const stat = useAppSelector(state => state.stat);
  const mapFlyto = useAppSelector(state => state.setMap.mapFlyto);
  let boundary: [[number, number], [number, number]] = [
    [74.576, 8.776],
    [147.957, 53.655]
  ]
  let preFeatureName = '';

  const dispatch = useAppDispatch();
  const popUp = useRef(new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  }));


  useMemo(() => {
    geojson?.features.forEach((feature, index) => {
      for (let name of provinceNames) {
        if (feature.properties.name.includes(name)) {
          nameToGeo.set(name, index);
          geoToName.set(feature.properties.name, name);
          break;
        }
      }
    });
  }, [geojson]);

  useMemo(() => {
    if (stat !== null && stat.data !== null)
      Object.keys(stat.data!).forEach((statName) => {
        for (let name of provinceNames) {
          if (statName.includes(name)) {
            nameToStat.set(name, statName);
            statToName.set(statName, name);
            break;
          }
        }
      })
  }, [stat]);

  const centers = useMemo(() => {
    const centers = new Map();
    geojson?.features.forEach(feature => {
      centers.set(feature.properties.name, center(feature.geometry as MultiPolygon));
    });
    return centers;
  }, [geojson])

  const getColorBySet = (value: number) => {
    const max = notes.maxNum;
    const min = notes.minNum;
    const colors = notes.colors;

    if (max <= min) return colors[0];
    const steps = colors.length;
    const stepSize = (max - min) / steps;
    let index = Math.floor((value - min) / stepSize);

    index = Math.max(0, Math.min(steps - 1, index));
    return colors[index];
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;
    const onLoad = async () => {
      if (!geojson) {
        const geo = (await agent.get<GeoJSONFeatureCollection>('https://geojson.cn/api/china/100000.json')).data;
        dispatch(setMapGeoJson(geo));
      }

      if (geojson) {
        mapRef.current?.addSource("province-source", {
          type: 'geojson',
          data: geojson as GeoJSON<Geometry, GeoJsonProperties>,
        });
        setLoaded(true);
        mapRef.current?.addLayer({
          id: 'province-outline',
          type: 'line',
          source: 'province-source',
          paint: {
            "line-color": "#ffffff",
            "line-width": 1,
          }
        });
      }
    }
    const mapToken = process.env.MAPBOX_TOKEN;
    mapboxgl.accessToken = mapToken;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [109.260, 35.931],
      zoom: 3,
      minZoom: 3.5,
    });

    // mapRef.current?.on('mousemove', _.throttle((e: MapMouseEvent) => {
    //   const lng = e.lngLat.lng.toFixed(6);
    //   const lat = e.lngLat.lat.toFixed(6);
    //   console.log(lng, lat);
    // }, 500))
    mapRef.current.on('load', onLoad)
    mapRef.current?.getCanvas().addEventListener('contextmenu', (e) => {
      e.stopPropagation();
    }, true);
    // mapRef.current?.getCanvas().addEventListener('keypress', (e) => {
    //   if(e.code === 'Space') {
    //     console.log(mapRef.current?.getZoom());
    //   }
    // })

    return () => {
      mapRef.current?.off('load', onLoad)
      setLoaded(false);
    }
  }, [geojson])

  useEffect(() => {
    if (stat && stat.data && loaded) {
      popUp.current.addTo(mapRef.current!)
      const hav_pro = new Set();
      let min = Number.MAX_SAFE_INTEGER / 2, max = -1;
      for (let key in stat.data) {
        const num = stat.data[key][stat.selectYear];
        min = Math.min(min, num);
        max = Math.max(max, num);
      }
      dispatch(setNum({ minNum: min, maxNum: max, colors: notes.colors, measure: notes.measure }))

      geojson?.features.forEach((feature) => {
        const provinceName = feature.properties.name;
        if (hav_pro.has(provinceName)) return;
        hav_pro.add(provinceName);
        if (mapRef.current?.getLayer(`province-${provinceName}`)) {
          mapRef.current?.setPaintProperty(`province-${provinceName}`, 'fill-color', getColorBySet(((): number => {
            const name = geoToName.get(feature.properties.name);
            if (name && nameToStat.has(name)) {
              return stat.data![nameToStat.get(name)!][stat.selectYear];
            }
            return 0;
          })()));
        }
        else
          mapRef.current?.addLayer({
            id: `province-${provinceName}`,
            type: 'fill',
            source: 'province-source',
            filter: ['==', ['get', 'name'], provinceName],
            paint: {
              'fill-color': getColorBySet(0),
              'fill-opacity': 1
            }
          })
      });
      // mapRef.current?.on('mousedown', (e) => {console.log('clicked')})
      mapRef.current?.on('mousemove', (e) => {
        const features = mapRef.current?.queryRenderedFeatures(e.point, {
          layers: geojson?.features.map(feature => `province-${feature.properties.name}`)
        });
        if (!features || features.length === 0) {
          popUp.current.remove();
          preFeatureName = "";
        } else if (features[0].properties?.name !== preFeatureName) {
          preFeatureName = features[0].properties?.name;

          const data = stat.data![nameToStat.get(geoToName.get(preFeatureName)!)!];
          createReactPopup(centers.get(preFeatureName).geometry.coordinates,
            <StatToolkits name={geoToName.get(preFeatureName)!} measure={notes.measure}
              data={data ? data[stat.selectYear] : data} />,
            popUp.current)
          popUp.current.addTo(mapRef.current!)
        }
      })
      mapRef.current?.moveLayer("province-outline");
    }
    return () => {
      popUp.current.remove();
    }
  }, [stat, loaded, notes])

  useEffect(() => {
    if (!mapFlyto) return;
    mapRef.current?.fitBounds([[mapFlyto[0], mapFlyto[1]], [mapFlyto[2], mapFlyto[3]]])
  }, [mapFlyto])

  if (loaded) {
    const box = bbox(geojson! as FeatureCollection)
    boundary = [[box[0], box[1]], [box[2], box[3]]];
    // mapRef.current?.on('click', (e) => {
    //   console.log(e.lngLat)
    // })
    mapRef.current?.on('move', () => {
      if (isReturningRef.current) {
        return;
      }
      const bounds = new mapboxgl.LngLatBounds([boundary[0], boundary[1]]);
      const center = mapRef.current!.getCenter();
      if (!bounds.contains(center)) {
        mapRef.current?.once('moveend', () => {
          isReturningRef.current = false;
        });
        isReturningRef.current = true;

        const target = getIntersection(bounds, [center.lng, center.lat]);
        mapRef.current?.easeTo({
          center: target[0] === 0 && target[1] === 0
            ? bounds.getCenter()
            : target
        })
      }
    })
  }

  return (
    <>
      <div ref={mapContainerRef} style={{ height: "100vh", width: "100%" }}>
      </div>
    </>
  )
}