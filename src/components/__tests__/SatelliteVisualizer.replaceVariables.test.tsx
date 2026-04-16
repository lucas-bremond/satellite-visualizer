import React from 'react';
import { render } from '@testing-library/react';

// Resium is mocked to avoid WebGL/DOM dependencies.
jest.mock('resium', () => ({
  Viewer: () => null,
  Clock: () => null,
  Entity: () => null,
  PointGraphics: () => null,
  ModelGraphics: () => null,
  PathGraphics: () => null,
  LabelGraphics: () => null,
}));

import { SatelliteVisualizer } from '../SatelliteVisualizer';

const baseProps = {
  // locations must be an array or the component will crash on .map()
  options: { locations: [] } as any,
  data: { series: [] } as any,
  timeRange: { from: { toDate: () => new Date(0) }, to: { toDate: () => new Date(0) } } as any,
  replaceVariables: jest.fn((str: string) => str),
} as any;

describe('SatelliteVisualizer: replaceVariables', () => {
  const replaceVariables = jest.fn((str: string) =>
    str.replace(`\${Example_Satellite_Name}`,"my-satellite")
  );

  beforeEach(() => replaceVariables.mockClear());

  it('leaves the URI unchanged when it contains no variables', () => {
    const plainUrl = `https://example.com/my-satellite.glb`;

    render(
      <SatelliteVisualizer
        {...baseProps}
        options={{ ...baseProps.options, modelAssetUri: plainUrl }}
        replaceVariables={replaceVariables}
      />
    );

    expect(replaceVariables).toHaveBeenCalledWith(plainUrl);
    expect(replaceVariables).toHaveReturnedWith(plainUrl);
  });

  it('replaces the variable in the URI', () => {
    const templateUrl = `https://example.com/\${Example_Satellite_Name}.glb`;
    const resolvedUrl = `https://example.com/my-satellite.glb`;

    render(
      <SatelliteVisualizer
        {...baseProps}
        options={{ ...baseProps.options, modelAssetUri: templateUrl }}
        replaceVariables={replaceVariables}
      />
    );

    expect(replaceVariables).toHaveBeenCalledWith(templateUrl);
    expect(replaceVariables).toHaveReturnedWith(resolvedUrl);
  });
});

