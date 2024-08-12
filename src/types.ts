export interface SimpleOptions {
  assetMode: AssetMode;

  pointSize: number;
  pointColor: string;

  modelScale: number;
  modelMinimumPixelSize: number;
  modelMaximumScale: number;
  modelAssetId: number | null;
  modelAssetUri: string | null;

  coordinatesType: CoordinatesType;

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
  point = 'point',
  model = 'model',
}

export enum CoordinatesType {
  cartesianFixed = 'cartesianFixed',
  cartesianInertial = 'cartesianInertial',
  geographic = 'geographic',
}

export interface Location {
  name: string;
  longitude: number;
  latitude: number;
  altitude: number;
}
