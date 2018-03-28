module.exports = function (Vue, options) {
  options = options || {};
  var self = this;

  var $typeof = this.$resolve('$typeof');
  var strict = this.strict;

  function fixName(name) {
    if (strict) {
      return name;
    }
    if (name.charAt(0) === '_' && name.substr(name.length -1) === '_') {
      return name;
    }
    return '_' + name + '_';
  }

  function setProperty(target, name, value) {
    Object.defineProperty(target, name, {
      enumerable : true,
      configurable : true,
      writable : true,
      value : value
    });
  }

  function resolveToTarget(dependencies, target, named) {
    if (!dependencies){
      return;
    }

    [].concat(dependencies)
      .forEach(function (dependency) {
        switch ($typeof(dependency)){
        case 'string': // resolve dependency and attach to the same-named property
          setProperty(target, dependency, self.$resolve(fixName(dependency), named));
          break;
        case 'object': // resolve each property and use the key as the property name
          // Aliases
          Object.keys(dependency)
            .forEach(function (key) {
              var value = dependency[key];
              if ($typeof(value) === 'string'){
                setProperty(target, key, self.$resolve(fixName(value), named));
              }
            });
          break;
        }
      });
  }

  function getOptionMergeStrategies(Vue) {
    while (Vue && !Vue.config) {
      Vue = Vue.super;
    }
    return (Vue && Vue.config && Vue.config.optionMergeStrategies) || {};
  }

  var mergeStrategies = getOptionMergeStrategies(Vue);
  mergeStrategies.dependencies = mergeStrategies.depnedencies || function (toVal, fromVal) {
    if (!toVal) {
      return fromVal;
    }
    if (!fromVal) {
      return toVal;
    }
    return [].concat(toVal).concat(fromVal).filter(function(v, i, a) { return a.indexOf(v) === i; });
  };

  Vue.mixin({
    beforeCreate : function () {
      var named = { $context : this };
      if (options.dependencies !== false) {
        resolveToTarget(this.dependencies, this, named);
        resolveToTarget(this.$options.dependencies, this, named);
      }
      if (options.components) {
        resolveToTarget(this.$options.components, this.$options.components, named);
      }
      if (options.mixins) {
        resolveToTarget(this.$options.mixins, this.$options.mixins, named);
      }
      if (options.directives) {
        resolveToTarget(this.$options.directives, this.$options.directives, named);
      }
    }
  });
};
