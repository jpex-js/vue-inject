# vue-inject
Dependency Injection for vue

Install...  
```
npm install vue-inject --save
```

Tell Vue about vue-inject...  
```javascript
// main.js
import injector from 'vue-inject';
import Vue from 'vue';
Vue.use(injector);
```


Register your services...  
```javascript
// myService.js
import injector from 'vue-inject';
class MyService{
  // ...
}
injector.service('myService', MyService);
```

Declare your dependencies...  
```javascript
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

When the Vue component is initialised, the injector attempts to resolve the values. For dependencies, the resolved value is attached to the component instance, whereas components and directives are passed to Vue to use as normal.  

A dependency can be a string, an array of strings, or an object, or even a combination of them all...
```javascript
export default {
  dependencies : [ 'myService', { myAlias : 'myService', myThingy : '$window' } ],
  created(){
    this.myService;
    this.myAlias;
    this.myThingy;
  }
}
```

You can mix and match injected and real components and directives:
```javascript
import SomeComponent from './components/some.vue';
export default {
  components : {
    SomeComponent : SomeComponent,
    InjectedComponent : 'InjectedComponent'
  }
}
```

You can also give services their own dependencies...
```javascript
// myService.js
import injector from 'vue-inject';
class MyService{
  constructor($window){
    this.$window = $window; // etc.
  }
}
injector.service('myService', MyService);
```
if you declared *myService* as a dependency of your component, it would know that MyService depends on the *$window* service and would attempt to resolve this as well.  

The dependencies are extracted from the function parameters, which means that a minification process can easily break this. To fix this, you can pass a list of string literals into the register function:  
```javascript
injector.service('myService', ['$window'], MyService);
```


vue-inject uses [jpex-web](https://www.npmjs.com/package/jpex-web) which in turn is a browser-safe variant of [jpex](https://www.npmjs.com/package/jpex), therefore all of the same functionality is available. The injector object has the ability to register factories, services, constants, and enums. It may be useful to have a read of the jpex documentation in order to understand the differences between these factory types.


You can access the resolver directly via the `get` property:
```javascript
import injector from 'vue-inject';
let $copy = injector.get('$copy');
```

If you have multiple Vue applications, you can create a new injector using `spawn`. By default this will create a brand new injector but if you want to share registered services/factories between the two, pass `true` into the function.
```javascript
let injector2 = injector.spawn();
```
