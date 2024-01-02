import { Vector } from '@grafana/data';

// https://grafana.com/developers/plugin-tools/migration-guides/update-from-grafana-versions/migrate-9_x-to-10_x#data-frame-field-values-are-now-just-arrays
export function coalesceToArray(vectorOrArray: any[] | Vector<any>): any[] {
  if (typeof vectorOrArray.toArray === 'function') {
    return vectorOrArray.toArray();
  }
  return vectorOrArray;
}
