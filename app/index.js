var $resolve;
var Jpex = require('jpex-web');
var Injector = Jpex.extend({
  dependencies : '$resolve',
  contructor : function(){
    $resolve = r;
  },
  static : {
    install : function (Vue, options) {
      Vue.mixin({
        beforeCreate : function(){
          var self = this;
          var dependencies = this.$options.dependencies;
          if (!dependencies){
            return;
          }

          var cached = { $context : this };

          // Dependencies can either be a string, an object, or an array of either
          // 'myService'
          // ['myService', 'myFactory']
          // {myAlias : 'myService'}
          [].concat(dependencies).forEach(function (dependency) {
            if (typeof dependency === 'object'){
              Object.keys(dependency).forEach(function (key) {
                self[key] = $resolve(dependency[key], cached);
              });
            }else{
              self[key] = $resolve(dependency, cached);
            }
          });
        }
      });
    }
  }
});

Injector();

module.exports = Injector;
module.exports.default = Injector;
