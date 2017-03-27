var Vue = {
  use(plugin){
    plugin.install(this);
  },
  mixin(config){
    Object.keys(config).forEach(key => {
      config[key].call(this);
    });
  },
  $options : {}
};

module.exports = function () {
  var Vue = {
    use(plugin){
      plugin.install(this);
    },
    mixin(config){
      Object.keys(config).forEach(key => {
        config[key].call(this);
      });
    },
    $options : {}
  };
  return Vue;
};
