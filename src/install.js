module.exports = function (Vue) {
  var self = this;

  var $typeof = this.$resolve('$typeof');

  function resolveToTarget(dependencies, target, named) {
    if (!dependencies){
      return;
    }

    [].concat(dependencies)
      .forEach(function (dependency) {
        switch ($typeof(dependency)){
        case 'string': // resolve dependency and attach to the same-named property
          target[dependency] = self.$resolve(dependency, named);
          break;
        case 'object': // resolve each property and use the key as the property name
          // Aliases
          Object.keys(dependency)
            .forEach(function (key) {
              var value = dependency[key];
              if ($typeof(value) === 'string'){
                target[key] = self.$resolve(value, named);
              }
            });
          break;
        }
      });
  }

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
