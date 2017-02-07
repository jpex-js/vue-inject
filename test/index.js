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
    thisObj.dependencies = ['$copy'];

    obj.beforeCreate.call(thisObj);
  }
};

injector.install(Vue);

injector.factory('foo', function () {
  return {};
}).lifecycle.class();
let a = injector.get('foo');
injector.clearCache();
injector.constant('foo', []);
let b = injector.get('foo');
console.log(a, b);
