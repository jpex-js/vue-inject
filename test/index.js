global.window = {};
const injector = require('vue-inject');
const Vue = {
  mixin : function (obj) {
    var thisObj = {};
    thisObj.$options = {};
    thisObj.$options.dependencies = ['$window', '$xhr'];
    thisObj.$options.components = {
      injectedComponent : '$promise',
      realComponent : { template : '<div />' }
    };

    obj.beforeCreate.call(thisObj);
  }
};

injector.install(Vue);

var $copy = injector.get('$copy');
var x = { foo : 'bah' };
var y = $copy(x);
console.log(y);
console.log(x === y);
