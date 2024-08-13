export interface SimpleOptions {
  assetMode: AssetMode;
  coordinatesType: CoordinatesType;

  pointSize: number;
  pointColor: string;

  modelScale: number;
  modelMinimumPixelSize: number;
  modelMaximumScale: number;
  modelAssetId: number | null;
  modelAssetUri: string | null;

  trajectoryShow: boolean;
  trajectoryWidth: number;
  trajectoryColor: string;
  trajectoryDashLength: number;

  locations: Location[];
  locationPointSize: number;
  locationPointColor: string;

  accessToken: string;

  subscribeToDataHoverEvent: boolean;

  showAnimation: boolean;
  showTimeline: boolean;
  showInfoBox: boolean;
  showBaseLayerPicker: boolean;
  showSceneModePicker: boolean;
  showProjectionPicker: boolean;
  showCredits: boolean;
}

export enum AssetMode {
  Point = 'Point',
  Model = 'Model',
}

export enum CoordinatesType {
  CartesianFixed = 'CartesianFixed',
  CartesianInertial = 'CartesianInertial',
  Geodetic = 'Geodetic',
}

export interface Location {
  name: string;
  longitude: number;
  latitude: number;
  altitude: number;
}
