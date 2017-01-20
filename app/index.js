var Jpex = require('jpex-web');
function createInjector(){
  let Injector = Jpex.extend({
    dependencies : ['$resolve', '$typeof', '$copy'],
    constructor : function ($resolve, $typeof, $copy) {
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
            resolveToTarget(this.dependencies, this, cached);
            resolveToTarget(this.$options.dependencies, this, cached);
            resolveToTarget(this.$options.components, this.$options.components, cached);
            resolveToTarget(this.$options.mixins, this.$options.mixins, cached);
            resolveToTarget(this.$options.directives, this.$options.directives, cached);
          }
        });

      };

      this.get = $resolve;

      this.spawn = function (preserve) {
        var NewInjector = preserve ? this.constructor : createInjector();
        return new NewInjector();
      };

      this.neverCache = false;

      this.service = function () {
        var result = Injector.Register.Service.apply(null, arguments);
        if (this.neverCache){
          result.lifecycle.none();
        }
        return result;
      };
      this.factory = function () {
        var result = Injector.Register.Factory.apply(null, arguments);
        if (this.neverCache){
          result.lifecycle.none();
        }
        return result;
      };
      this.constant = function () {
        var result = Injector.Register.Constant.apply(null, arguments);
        if (this.neverCache){
          result.lifecycle.none();
        }
        return result;
      };
      this.interface = function () {
        var result = Injector.Register.Interface.apply(null, arguments);
        if (this.neverCache){
          result.lifecycle.none();
        }
        return result;
      };
      this.enum = function () {
        var result = Injector.Register.Enum.apply(null, arguments);
        if (this.neverCache){
          result.lifecycle.none();
        }
        return result;
      };
    }
  });
  return Injector;
}

var Injector = createInjector();
var injector = new Injector();

module.exports = injector;
module.exports.default = injector;
