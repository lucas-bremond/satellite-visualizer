export interface SimpleOptions {
  baseLayerPicker: boolean;
  sceneModePicker: boolean;
  projectionPicker: boolean;

  assetMode: AssetMode;

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

  subscribeToDataHoverEvent: boolean;

  accessToken: string;

  showCredits: boolean;
}

export enum AssetMode {
  point = 'point',
  model = 'model',
}
