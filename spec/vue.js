// var Vue = {
//   use(plugin, options){
//     plugin.install(this, options);
//   },
//   mixin(config){
//     Object.keys(config).forEach(key => {
//       config[key].call(this);
//     });
//   },
//   $options : {}
// };

module.exports = function () {
  var Vue = {
    use(plugin, options){
      plugin.install(this, options);
    },
    mixin(config){
      Object.keys(config).forEach(key => {
        config[key].call(this);
      });
    },
    $options : {},
    config: {
      optionMergeStrategies: {},
    },
  };
  return Vue;
};
