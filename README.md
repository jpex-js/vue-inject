# vue-inject
Dependency Injection for vue

[![npm version](https://badge.fury.io/js/vue-inject.svg)](https://badge.fury.io/js/vue-inject)
[![Build Status](https://travis-ci.org/jpex-js/vue-inject.svg?branch=master)](https://travis-ci.org/jpex-js/vue-inject)
[![Code Climate](https://codeclimate.com/github/jpex-js/vue-inject/badges/gpa.svg)](https://codeclimate.com/github/jpex-js/vue-inject)
[![Test Coverage](https://codeclimate.com/github/jpex-js/vue-inject/badges/coverage.svg)](https://codeclimate.com/github/jpex-js/vue-inject/coverage)

## Usage  
### Install...  
```
npm install vue-inject --save-dev
```

### Tell Vue about vue-inject...  
```javascript
// main.js
import injector from 'vue-inject';
import Vue from 'vue';
Vue.use(injector);
```


### Register your services...  
```javascript
// myService.js
import injector from 'vue-inject';
class MyService{
  // ...
}
injector.service('myService', MyService);
```

### Declare your dependencies...  
```html
// myComponent.vue
<script>
  export default {
    dependencies : ['myService'],
    components : ['MyChildComponent'],
    directive : ['myDirective'],
    methods : {
      foo(){
        return this.myService.something();
      }
    }
  }
</script>
```

## Application Structure  
Example:   
```
/
  main.js
  app.vue
  app_start.js
  constants.js
  services.js
```

```javascript
// main.js
import Vue from 'vue';
import injector from 'vue-inject';
import App from './app';

// app_start will load anything that can be injected into your application
require('./app_start');

// register the injector with Vue
Vue.use(injector);

// render the main component
new Vue({
  render : h => h(App)
});

```

```javascript
// app_start.js
require('./constants');
require('./services');

// By requiring these files, the factories and services will be registered with the injector.
// You could just export the factory functions and register them all here, but this would mean
// separating the function from the array of dependencies it uses.
```

```javascript
// constants.js
import injector from 'vue-inject';
import axios from 'axios';

injector.constant('apiRoot', 'http://www.fake.com/api');
injector.constant('axios', axios);
```

```javascript
// services.js
import injector from 'vue-inject';

function apiUrlBuilder(apiRoot){
  return function(path){
    return apiRoot + '/' + path;
  }
}
injector.factory('apiUrlBuilder', 'apiRoot', apiUrlBuilder);

function api(apiUrlBuilder, axios){
  this.get(path){
    var url = apiUrlBuilder(path);
    return axios.get(url);
  };
}
injector.service('api', ['apiUrlBuilder', 'axios'], api);
```

```html
// app.vue
<template>
  <div>...</div>
</template>
<script>
  export default {
    dependencies : 'api',
    data(){
      return {
        stuff : null
      };
    },
    created(){
      // api has been injected in by vue-inject
      this.api.get('stuff').then(response => this.stuff = response.data);
    }
  };
</script>
```

## API  
### injector
The injector is used to register dependencies that can then be injected into a component.
```javascript
var injector = require('vue-inject');
```
The injector must be regstered on the Vue class:
```javascript
Vue.use(injector);
```
You can supply an options object to determine which properties will be injected.
```js
Vue.use(injector, { dependencies: true, mixins: true, directives: true, components: true });
```
By default only `dependencies` is enabled.

#### service(name, [dependencies], constructor)
Registers a service. A service takes a constructor function (or an ES6 class). When a service is injected into a component, the constructor is instantiated.  
The dependencies option determine which dependencies to inject into the constructor. These will be passed into the function in the same order.
```javascript
injector.service('myService', ['injected'], function(injected){
  this.foo = () => {};
});
```

#### factory(name, [dependencies], function)
Registers a factory. When injected, the function is called and the return value is then passed into the component.  
Similarly to the `service` type, any dependencies are injected into the function parameters.  
```javascript
injector.factory('myFactory', ['injected'], function(injected){
  return {
    foo : () => {}
  };
});
```

#### constant(name, value);
Registers a constant value.
```javascript
injector.constant('myConstant', { foo : 'bah' })
```

#### decorator(name, function)
Registers a decorator. A decorator allows you to modify an existing factory. The return value of the function is then used as the resolved factory.
```javascript
injector.decorator('myFactory', function (myFactory) {
  myFactory.foo = 'decorated';
  return myFactory;
});
```

#### get(name, [namedDependencies])
Component dependencies are calculated automatically, however, there may be times when you want to use a dependency outside of a component. This allows you to pull a dependency directory from the injector. The value is resolved in exactly the same way.
```javascript
var myService = injector.get('myService');
myService.doStuff();
```
The namedDependencies parameter accepts an object with custom values for a dependency. For example: if your factory depends on an *apiUrl* constant, you can overwrite the value of that constant by passing in a new value.
```javascript
var myService = injector.get('myService', { apiUrl : 'localhost:3000/' });
myService.createUrl('foo') === 'localhost:3000/foo';
```

#### reset()
Removes all registered factories from the injector.

#### clearCache()
Once a dependency has been injected, its value is cached (see *lifecycles* below). Usually this is fine, as most factories will be stateless. However sometimes it is necessary to recalculate a factory, such as when unit testing. Clear cache sets all registered factories to an unresolved state. The next time they are injected, the values will be recalculated.
```javascript
injector.factory('obj', () => { return {}; });

var a = injector.get('obj');
var b = injector.get('obj');
a === b; // true

injector.clearCache();

var c = injector.get('obj');
a === c; // false
```

#### spawn(extend)
If you have multiple Vue applications, you can create a new injector using `spawn`.
```javascript
let injector2 = injector.spawn();
```
By default this will create a brand new injector, but if you want to share registered services/factories between the two, pass `true` into the function. This will create a new injector that *inherits* the previous one. Any factories registered on the first injector will be available to the second, but not vice versa.

#### strict
If set to `false` then all dependencies will be made optional. If a component's dependency cannot be found, rather than throwing an error it will just be set to `undefined`. Not that this does not affect the `get` function.

### Lifecycle
When registering a factory or service, it's possible to determine the lifecycle.
*As of v0.4, the default lifecycle is set to `class`*.

#### application
Caches the value the first time the factory is injected. This value is then re-used every time.
```javascript
injector.factory('myFactory', fn).lifecycle.application();
```
#### none
Never caches the value. Every time the factory is injected, the value is recalculated.
```javascript
injector.factory('myFactory', fn).lifecycle.none();
```
#### class
Caches the value against the current injector. If you have multiple injectors, the value will be cached against the current injector only, any other injectors will have to recalculate its value.
```javascript
injector.factory('myFactory', fn).lifecycle.class();
```

### Injecting into Components
There are number of ways you can inject a dependency into a Vue component:
#### dependencies
The most common way is to declare your dependencies on the component:
```javascript
export default {
  data(){},
  computed : {},
  methods : {},
  dependencies : ['myFactory']
};
```
The `dependencies` property accepts either a string, an array, or an object:  
##### array
For each string in the array, the injector will find the corresponding factory and inject it into the component.
```javascript
dependencies : ['dep1', 'dep2', 'dep3']
```
##### string
This is the same as supplying an array with a single element.
##### object
An object allows you to specify an alias for a factory.
```javascript
dependencies : { myAlias : 'myFactory' }
```
then in your component you can access the injected *myFactory* instance via `this.myAlias`.

> For the following methods, you must enable their related options when calling Vue.use

#### components
If you register components on the injector you can then inject them into the components property:
```javascript
components : { myComponent : 'injectedComponent' }
```
#### directives
The same is true for directives:
```javascript
directives : { myDirective : 'injectedDirective' }
```
#### prototype
You can also add a `dependencies` object to Vue's `prototype`. These dependencies will then be injected into every component.
```javascript
Vue.prototype.dependencies = ['myService'];
```

### factories
The injector comes bundled with [jpex-web](https://www.npmjs.com/package/jpex-web) and [jpex-defaults](https://www.npmjs.com/package/jpex-defaults), meaning that you have access to the following factories automatically:

#### $copy
Performs either a deep or shallow copy of an object.
```javascript
$copy(obj); // shallow copy
$copy.shallow(obj); // shallow copy
$copy.deep(obj); // deep copy
$copy.extend(newObj, obj, obj2); // Deep copies obj2 and obj into newObj.
```
#### $typeof
Returns the type of an object. This goes further than `typeof` in that it differentiates between objects, arrays, dates, regular expressions, null, etc.
```javascript
var t = $typeof('hw'); // 'string'
```
#### $log
Wraps the console functions.
```javascript
$log('log');
$log.log('log');
$log.warn('warning');
$log.error('Error');
```
#### $promise
Wraps up the Promise class and includes a simple polyfill implementation if needed. It exposes all of Promise's static methods i.e. `resolve`, `reject`, `all`, and `race`.  
```javascript
return $promise((resolve, reject) => {});
```
#### $resolve
Equivalent of `injector.get()`.
#### $timeout
Equivalent of `setTimeout()`.
#### $interval
Equivalent of `setInterval()`.
#### $immediate
Equivalent of `setImmediate()` or `setTimeout(fn, 0)`.
#### $window
Injects the global window object.
#### $document
Injectors the global document object;

## Manually extending vue-inject
As **vue-inject** is built from [jpex](https://www.npmjs.com/package/jpex), the Jpex API is fully available for additional configuration. You can even manually create an injector with custom settings using Jpex's `extend` method:
```javascript
const injector = vueInject.extend({
  defaultLifecycle : 1 // application
  // more config options...
});
```
