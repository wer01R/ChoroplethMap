import { LngLatBounds } from "mapbox-gl";
import {lineString} from '@turf/helpers'
import {bboxPolygon } from '@turf/bbox-polygon'
import lineIntersect from "@turf/line-intersect";

export function getRandomColor(seed: number) {
  const colors = ['#FF5733', '#33FF57', '#3357FF', '#F0A500', '#B833FF', '#33FFF2'];
  return colors[seed % colors.length];
}

export const provinceNames: string[] = [
  "北京", "天津", "上海", "重庆", "河北", "山西",
  "辽宁", "吉林", "黑龙江", "江苏", "浙江", "安徽",
  "福建", "江西", "山东", "河南", "湖北", "湖南",
  "广东", "海南", "四川", "贵州", "云南", "陕西",
  "甘肃", "青海", "台湾", "内蒙古", "广西", "西藏",
  "宁夏", "新疆", "香港", "澳门"
];

export function getIntersection(bounds: LngLatBounds, 
    point: [number, number]): [number, number] 
{
  const center = bounds.getCenter();
  const ray = lineString([point, [center.lng, center.lat]]);

  const boundary = bboxPolygon([
    bounds.getWest() + 10,
    bounds.getSouth() + 10,
    bounds.getEast() - 10,
    bounds.getNorth() - 10,
  ])

  const intersection = lineIntersect(boundary, ray).features;
  if(intersection.length > 0) 
    return [intersection[0].geometry.coordinates[0], intersection[0].geometry.coordinates[1]];
  return  [0, 0];
}