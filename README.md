# Satellite Visualizer

A satellite visualization panel plugin for Grafana based on [CesiumJS](https://cesium.com/platform/cesiumjs/).

![screenshot.png](./src/img/screenshot.png)

## Settings

1. Set `Access token` with a [Cesium ion access token](https://cesium.com/learn/ion/cesium-ion-access-tokens/).
2. (optional) Set `Asset ID` with ID of the [glTF](https://www.khronos.org/gltf/) asset stored in Cesium ion.

## Data

This plugin needs a data series with 8 columns:

- Column 1: Time
- Colume 2-4: Position vector in ECEF (x, y, z)
- Colume 5-8: Orientation quaternion in ECI (x, y, z, s)
