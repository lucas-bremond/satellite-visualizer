import React, { useEffect, useState } from 'react';
import { PanelProps, DataHoverEvent, LegacyGraphHoverEvent } from '@grafana/data';
import { AssetMode, SimpleOptions, CoordinatesType } from 'types';
import { coalesceToArray } from 'utilities';
import { css, cx } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';

import { Viewer, Clock, Entity, PointGraphics, ModelGraphics, PathGraphics, LabelGraphics } from 'resium';
import {
  Ion,
  JulianDate,
  TimeInterval,
  TimeIntervalCollection,
  Cartesian3,
  Quaternion,
  Transforms,
  SampledProperty,
  SampledPositionProperty,
  Color,
  PolylineDashMaterialProperty,
  IonResource,
  Cartesian2,
  Matrix3,
} from 'cesium';

import 'cesium/Build/Cesium/Widgets/widgets.css';

interface Props extends PanelProps<SimpleOptions> {}

const getStyles = () => {
  return {
    wrapper: css`
      font-family: Open Sans;
      position: relative;
    `,
    svg: css`
      position: absolute;
      top: 0;
      left: 0;
    `,
    textBox: css`
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 10px;
    `,
    showCesiumCredits: css`
      display: block;
    `,
    hideCesiumCredits: css`
      display: none;
    `,
  };
};

export const SatelliteVisualizer: React.FC<Props> = ({ options, data, timeRange, width, height, eventBus }) => {
  Ion.defaultAccessToken = options.accessToken;

  const styles = useStyles2(getStyles);

  const [isLoaded, setLoaded] = useState<boolean>(false);
  const [viewerKey, setViewerKey] = useState<number>(0);

  const [timestamp, setTimestamp] = useState<JulianDate | null>(null);
  const [satelliteAvailability, setSatelliteAvailability] = useState<TimeIntervalCollection | null>(null);
  const [satellitePosition, setSatellitePosition] = useState<SampledPositionProperty | null>(null);
  const [satelliteOrientation, setSatelliteOrientation] = useState<SampledProperty | null>(null);

  const [satelliteResource, setSatelliteResource] = useState<IonResource | string | undefined>(undefined);

  useEffect(() => {
    const timeInterval = new TimeInterval({
      start: JulianDate.fromDate(timeRange.from.toDate()),
      stop: JulianDate.addDays(JulianDate.fromDate(timeRange.to.toDate()), 1, new JulianDate()),
    });

    // https://community.cesium.com/t/correct-way-to-wait-for-transform-to-be-ready/24800
    Transforms.preloadIcrfFixed(timeInterval).then(() => setLoaded(true));
  }, [timeRange]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (data.series.length === 1) {
      const dataFrame = data.series[0];

      if (dataFrame.fields.length !== 8) {
        throw new Error(`Invalid number of fields [${dataFrame.fields.length}] in data frame.`);
      }

      let timeFieldValues = coalesceToArray(dataFrame.fields[0].values);

      const startTimestamp: number | null = timeFieldValues[0] ?? null;
      const endTimestamp: number | null = timeFieldValues.at(-1) ?? null;

      if (endTimestamp !== null) {
        setTimestamp(JulianDate.fromDate(new Date(endTimestamp)));
      } else {
        setTimestamp(null);
      }

      if (startTimestamp && endTimestamp) {
        setSatelliteAvailability(
          new TimeIntervalCollection([
            new TimeInterval({
              start: JulianDate.fromDate(new Date(startTimestamp)),
              stop: JulianDate.fromDate(new Date(endTimestamp)),
            }),
          ])
        );
      } else {
        setSatelliteAvailability(null);
      }

      const positionProperty = new SampledPositionProperty();
      const orientationProperty = new SampledProperty(Quaternion);

      for (let i = 0; i < dataFrame.fields[1].values.length; i++) {
        const time = JulianDate.fromDate(new Date(coalesceToArray(dataFrame.fields[0].values)[i]));

        const DCM_ECI_ECEF = Transforms.computeFixedToIcrfMatrix(time);

        let x_ECEF: Cartesian3;
        switch (options.coordinatesType) {
          case CoordinatesType.CartesianFixed:
            x_ECEF = new Cartesian3(
              coalesceToArray(dataFrame.fields[1].values)[i],
              coalesceToArray(dataFrame.fields[2].values)[i],
              coalesceToArray(dataFrame.fields[3].values)[i]
            );
            break;
          case CoordinatesType.CartesianInertial:
            x_ECEF = Matrix3.multiplyByVector(
              Matrix3.transpose(DCM_ECI_ECEF, new Matrix3()),
              new Cartesian3(
                coalesceToArray(dataFrame.fields[1].values)[i],
                coalesceToArray(dataFrame.fields[2].values)[i],
                coalesceToArray(dataFrame.fields[3].values)[i]
              ),
              new Cartesian3()
            );
            break;
          default:
            x_ECEF = Cartesian3.fromDegrees(
              coalesceToArray(dataFrame.fields[1].values)[i],
              coalesceToArray(dataFrame.fields[2].values)[i],
              coalesceToArray(dataFrame.fields[3].values)[i]
            );
            break;
        }

        const q_B_ECI = new Quaternion(
          coalesceToArray(dataFrame.fields[4].values)[i],
          coalesceToArray(dataFrame.fields[5].values)[i],
          coalesceToArray(dataFrame.fields[6].values)[i],
          coalesceToArray(dataFrame.fields[7].values)[i]
        );

        positionProperty.addSample(time, x_ECEF);

        const q_ECI_ECEF = Quaternion.fromRotationMatrix(DCM_ECI_ECEF);
        const q_ECEF_ECI = Quaternion.conjugate(q_ECI_ECEF, new Quaternion());
        const q_B_ECEF = Quaternion.multiply(q_ECEF_ECI, q_B_ECI, new Quaternion());

        orientationProperty.addSample(time, q_B_ECEF);
      }

      setSatellitePosition(positionProperty);
      setSatelliteOrientation(orientationProperty);
    }
  }, [data, options, isLoaded]);

  useEffect(() => {
    Ion.defaultAccessToken = options.accessToken;
  }, [options.accessToken]);

  useEffect(() => {
    if (options.modelAssetId) {
      IonResource.fromAssetId(options.modelAssetId, { accessToken: options.accessToken })
        .then((resource) => {
          setSatelliteResource(resource);
        })
        .catch((error) => {
          throw new Error(`Error loading Ion Resource of Model: [${error}].`);
        });
    } else if (options.modelAssetUri) {
      setSatelliteResource(options.modelAssetUri);
    } else {
      setSatelliteResource(undefined);
    }
  }, [options.modelAssetId, options.modelAssetUri, options.accessToken]);

  useEffect(() => setViewerKey((prevKey) => prevKey + 1), [options]);

  useEffect(() => {
    if (!options.subscribeToDataHoverEvent) {
      return;
    }

    const dataHoverSubscriber = eventBus.getStream(DataHoverEvent).subscribe((event) => {
      if (event?.payload?.point?.time) {
        setTimestamp(JulianDate.fromDate(new Date(event.payload.point.time)));
      }
    });

    const graphHoverSubscriber = eventBus.getStream(LegacyGraphHoverEvent).subscribe((event) => {
      if (event?.payload?.point?.time) {
        setTimestamp(JulianDate.fromDate(new Date(event.payload.point.time)));
      }
    });

    return () => {
      dataHoverSubscriber.unsubscribe();
      graphHoverSubscriber.unsubscribe();
    };
  }, [eventBus, options.subscribeToDataHoverEvent]);

  return (
    <div
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
        `
      )}
    >
      <Viewer
        full
        animation={options.showAnimation}
        timeline={options.showTimeline}
        infoBox={options.showInfoBox}
        baseLayerPicker={options.showBaseLayerPicker}
        sceneModePicker={options.showSceneModePicker}
        projectionPicker={options.showProjectionPicker}
        navigationHelpButton={false}
        fullscreenButton={false}
        geocoder={false}
        homeButton={false}
        key={viewerKey}
        creditContainer="cesium-credits"
      >
        {timestamp && <Clock currentTime={timestamp} />}
        {satelliteAvailability && satellitePosition && satelliteOrientation && (
          <Entity
            availability={satelliteAvailability}
            position={satellitePosition}
            orientation={satelliteOrientation}
            tracked={true}
          >
            {options.assetMode === AssetMode.Point && (
              <PointGraphics pixelSize={options.pointSize} color={Color.fromCssColorString(options.pointColor)} />
            )}
            {options.assetMode === AssetMode.Model && satelliteResource && (
              <ModelGraphics
                uri={satelliteResource}
                scale={options.modelScale}
                minimumPixelSize={options.modelMinimumPixelSize}
                maximumScale={options.modelMaximumScale}
              />
            )}
            {options.trajectoryShow && (
              <PathGraphics
                width={options.trajectoryWidth}
                material={
                  new PolylineDashMaterialProperty({
                    color: Color.fromCssColorString(options.trajectoryColor),
                    dashLength: options.trajectoryDashLength,
                  })
                }
              />
            )}
          </Entity>
        )}
        {options.locations.map((location, index) => (
          <Entity
            name={location.name}
            position={Cartesian3.fromDegrees(location.longitude, location.latitude, location.altitude)}
            key={index}
          >
            <PointGraphics
              pixelSize={options.locationPointSize}
              color={Color.fromCssColorString(options.locationPointColor)}
            />
            <LabelGraphics text={location.name} pixelOffset={new Cartesian2(30.0, 30.0)} />
          </Entity>
        ))}
      </Viewer>

      <div
        id="cesium-credits"
        className={options.showCredits ? styles.showCesiumCredits : styles.hideCesiumCredits}
      ></div>
    </div>
  );
};
