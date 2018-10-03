var _ = require('lodash'),
  path = require('path');

var initGlobalConfig = function () {
  // Get the default config
  var defaultConfig = require(path.join(process.cwd(), 'server/env/default'));

  // Get the hidden local config
  var localConfig = require(path.join(process.cwd(), 'server/env/local-dev')) || {};

  // Merge config files
  var config = _.merge(defaultConfig, localConfig);
  
  return config;
};

module.exports.config = initGlobalConfig();
