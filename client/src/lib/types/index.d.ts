export interface GeoJSONFeatureCollection {
  type: "FeatureCollection"
  name: string
  crs: CoordinateReferenceSystem
  features: GeoJSONFeature[]
}

export interface CoordinateReferenceSystem {
  type: string
  properties: CRSProperties
}

export interface CRSProperties {
  name: string
}

export interface GeoJSONFeature {
  type: "Feature"
  properties: ProvinceProperties
  geometry: Geometry
}

export interface ProvinceProperties {
	name: string,
	code: string,
	level: Enum<0, 1, 2, 3>,
	center: [lng, lat],
	fullname?: string,
	filename?: string,
	pinyin?: string,
}

export interface Geometry {
  type: "Polygon" | "MultiPolygon"
  coordinates: number[][][][] | number[][][]  // 根据是 MultiPolygon 还是 Polygon
}


export type statData = {
  years: string[],
  data: statDataProvince?
}

export type statDataProvince = {
  [北京市: string]: statDataYearly
  天津市: statDataYearly
  河北省: statDataYearly
  山西省: statDataYearly
  内蒙古自治区: statDataYearly
  辽宁省: statDataYearly
  吉林省: statDataYearly
  黑龙江省: statDataYearly
  上海市: statDataYearly
  江苏省: statDataYearly
  浙江省: statDataYearly
  安徽省: statDataYearly
  福建省: statDataYearly
  江西省: statDataYearly
  山东省: statDataYearly
  河南省: statDataYearly
  湖北省: statDataYearly
  湖南省: statDataYearly
  广东省: statDataYearly
  广西壮族自治区: statDataYearly
  海南省: statDataYearly
  重庆市: statDataYearly
  四川省: statDataYearly
  贵州省: statDataYearly
  云南省: statDataYearly
  西藏自治区: statDataYearly
  陕西省: statDataYearly
  甘肃省: statDataYearly
  青海省: statDataYearly
  宁夏回族自治区: statDataYearly
  新疆维吾尔自治区: statDataYearly
}
export interface statDataYearly {
  [key: string]: number
  "2024年": number
  "2023年": number
  "2022年": number
  "2021年": number
  "2020年": number
  "2019年": number
  "2018年": number
  "2017年": number
  "2016年": number
  "2015年": number
}