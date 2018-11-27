var _ = require('lodash'),
  path = require('path');

var initGlobalConfig = function () {
  // Get the default config
  var defaultConfig = require(path.resolve('server/env/default'));

  // Get the hidden local config
  var localConfig = require(path.resolve('server/env/local-dev')) || {};

  // Merge config files
  var config = _.merge(defaultConfig, localConfig);

  return config;
};

module.exports = initGlobalConfig();
