# Satellite Visualizer

![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?logo=grafana&query=$.version&url=https://grafana.com/api/plugins/lucasbremond-satellitevisualizer-panel&label=Marketplace&prefix=v&color=F47A20)

A satellite visualization panel plugin for Grafana based on [CesiumJS](https://cesium.com/platform/cesiumjs/).

## Settings

1. Set `Access token` with a [Cesium ion access token](https://cesium.com/learn/ion/cesium-ion-access-tokens/) ([security best practices](https://cesium.com/learn/ion/cesium-ion-access-tokens/#security-best-practices-for-tokens)).
2. (optional) Set `Asset ID` with ID of the [glTF](https://www.khronos.org/gltf/) asset stored in Cesium ion.

## Data

This plugin needs a data series with 8 columns:

| Column # | Description                                             |
| -------- | ------------------------------------------------------- |
| 1        | Time                                                    |
| 2        | Longitude (`deg`)                                       |
| 3        | Latitude (`deg`)                                        |
| 4        | Altitude (`m`)                                          |
| 5-8      | Orientation in inertial frame (`x, y, z, s` quaternion) |

## References

- [CesiumJS](https://cesium.com/platform/cesiumjs/)
- [Resium](https://resium.reearth.io/)
