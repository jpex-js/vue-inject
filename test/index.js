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
