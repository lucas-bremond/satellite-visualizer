import React from 'react';
import { StandardEditorProps } from '@grafana/data';

import { Location } from './types';

export const LocationEditor: React.FC<StandardEditorProps<Location[]>> = ({ value, onChange }) => {
  const addLocation = () => {
    const newLocations = [...value, { name: 'Unnamed', longitude: 0.0, latitude: 0.0, altitude: 0.0 }];
    onChange(newLocations);
  };

  const updateLocation = (index: number, updatedPoint: Location) => {
    const newLocations = value.map((p, i) => (i === index ? updatedPoint : p));
    onChange(newLocations);
  };

  const deletePoint = (index: number) => {
    const newLocations = value.filter((_, i) => i !== index);
    onChange(newLocations);
  };

  return (
    <div>
      {value.map((location, index) => (
        <div key={index}>
          <input
            type="text"
            value={location.name}
            onChange={(e) => updateLocation(index, { ...location, name: e.target.value })}
          />
          <input
            type="number"
            value={location.longitude}
            onChange={(e) => updateLocation(index, { ...location, longitude: +e.target.value })}
          />
          <input
            type="number"
            value={location.latitude}
            onChange={(e) => updateLocation(index, { ...location, latitude: +e.target.value })}
          />
          <input
            type="number"
            value={location.altitude}
            onChange={(e) => updateLocation(index, { ...location, altitude: +e.target.value })}
          />
          <button onClick={() => deletePoint(index)}>Delete</button>
        </div>
      ))}
      <button onClick={addLocation}>Add Location</button>
    </div>
  );
};
