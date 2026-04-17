// force timezone to UTC to allow tests to work regardless of local timezone
// generally used by snapshots, but can affect specific tests
process.env.TZ = 'UTC';

module.exports = {
  // Jest configuration provided by Grafana scaffolding
  ...require('./.config/jest.config'),
  // CESIUM_BASE_URL is normally injected by webpack at build time
  globals: { CESIUM_BASE_URL: '' },
};
