var Jpex = require('jpex-web');
function createInjector(Parent){
  Parent = Parent || Jpex;
  var Injector = Parent.extend({
    dependencies : ['$resolve', '$typeof', '$copy'],
    constructor : function ($resolve, $typeof, $copy) {
      function resolveToTarget(dependencies, target, named) {
        if (!dependencies){
          return;
        }
        dependencies = [].concat(dependencies);

        dependencies.forEach(function (dependency) {
          switch ( $typeof(dependency)){
            case 'string':
              target[dependency] = $resolve(dependency, named);
              break;
            case 'object':
              Object.keys(dependency).forEach(function (key) {
                var value = dependency[key];
                if ($typeof(value) === 'string'){
                  target[key] = $resolve(dependency[key], named);
                };
              });
              break;
          }
        });
      }

      this.install = function (Vue, options) {
        Vue.mixin({
          beforeCreate : function () {
            var named = { $context : this };
            resolveToTarget(this.dependencies, this, named);
            resolveToTarget(this.$options.dependencies, this, named);
            resolveToTarget(this.$options.components, this.$options.components, named);
            resolveToTarget(this.$options.mixins, this.$options.mixins, named);
            resolveToTarget(this.$options.directives, this.$options.directives, named);
          }
        });

      };

      this.get = $resolve;

      this.reset = function(){
        Object.keys(Injector._factories).forEach(function (k) {
          delete Injector._factories[k];
        });
        Object.keys(Injector._resolved).forEach(function (k) {
          delete Injector._resolved[k];
        });
      };

      this.clearCache = function (forever) {
        Object.keys(Injector._factories).forEach(function (k) {
          Injector._factories[k].resolved = false;
          if (forever){
            Injector._factories[k].lifecycle = 4; // None
          }
        });
        Object.keys(Injector._resolved).forEach(function (k) {
          delete Injector._resolved[k];
        });
      };

      this.spawn = function (extend) {
        var NewInjector = createInjector(extend && Injector);
        return new NewInjector();
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
  return Injector;
}

var Injector = createInjector();
var injector = new Injector();

module.exports = injector;
module.exports.default = injector;
