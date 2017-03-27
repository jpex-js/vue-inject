var Jpex = require('jpex/src');
var jpexConstants = require('jpex/src/constants');
var plugin = require('./plugin');
var install = require('./install');

var Base = module.exports = Jpex.extend({
  config : {
    defaultLifecycle : jpexConstants.CLASS
  }
});

if (!Base.$$using['jpex-web']){
  Base.use(require('jpex-web'));
}

Base.use(plugin);

// Delete all registered factories
Base.reset = function () {
  var self = this;
  this.clearCache();
  Object.keys(this.$$factories)
    .forEach(function (key) {
      delete self.$$factories[key];
    });
};

// Create a new injector
Base.spawn = function (extend) {
  if (extend){
    return this.extend();
  }else{
    return Base.extend();
  }
};

// Install method used by Vue.use
Base.install = install;
