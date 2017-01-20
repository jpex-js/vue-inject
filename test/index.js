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

injector.constant('foo', 'bah');
console.log(injector.constructor._factories.foo);
injector.reset();
console.log(injector.constructor._factories.foo);

injector.factory('forever', function(){
  return {};
}, true);

let a = injector.get('forever');
let b = injector.get('forever');
console.log(a === b);

injector.clearCache();
let c = injector.get('forever');
console.log(a !== c);
