export const getConfig = path => {
  let defaultConfig = require('react-uikit/config/' + path).default;
  try {
    const customConfig = require('react-uikit-config/' + path).default;
    defaultConfig = { ...defaultConfig, ...customConfig };
  } catch (e) {}
  return defaultConfig;
};
