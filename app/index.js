var Jpex = require('jpex-web');
var Injector = Jpex.extend({
  dependencies : ['$resolve', '$typeof'],
  constructor : function ($resolve, $typeof) {
    function resolveToTarget(dependencies, target, cached) {
      if (!dependencies){
        return;
      }
      dependencies = [].concat(dependencies);

      dependencies.forEach(function (dependency) {
        switch ( $typeof(dependency)){
          case 'string':
            target[dependency] = $resolve(dependency, cached);
            break;
          case 'object':
            Object.keys(dependency).forEach(function (key) {
              var value = dependency[key];
              if ($typeof(value) === 'string'){
                target[key] = $resolve(dependency[key], cached);
              };
            });
            break;
        }
      });
    }

    this.install = function (Vue, options) {
      Vue.mixin({
        beforeCreate : function () {
          var cached = { $context : this };

          resolveToTarget(this.$options.dependencies, this, cached);
          resolveToTarget(this.$options.components, this.$options.components, cached);
          resolveToTarget(this.$options.mixins, this.$options.mixins, cached);
          resolveToTarget(this.$options.directives, this.$options.directives, cached);
        }
      });
    };

    this.service = function () {
      return Injector.Register.Service.apply(null, arguments);
    };
    this.factory = function () {
      return Injector.Register.Factory.apply(null, arguments);
    };
    this.constant = function () {
      return Injector.Register.Constant.apply(null, arguments);
    };
    this.interface = function () {
      return Injector.Register.Interface.apply(null, arguments);
    };
    this.enum = function () {
      return Injector.Register.Enum.apply(null, arguments);
    };
  }
});

var injector = new Injector();

module.exports = injector;
module.exports.default = injector;
