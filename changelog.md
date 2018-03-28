## 2.0.1
- Fixed an issue where doing `Vue.extend().use(vueInject)` meant vue inject could not find `optionMergeStrategies`

## 2.0.0
- Injecting components/mixins/directives is now optional
- There is now a default merging strategy for when using mixins with dependencies
- Added a `injector.strict` option which makes all dependencies optional. Note this doesn't affect `injector.get`

## 1.0.0
- Upgraded to Jpex 2.0.0  
- Methods like `clearCache` and `get` now mirror Jpex's `$clearCache` and `$resolve` methods.  
- Added decorators
- Removed enum and interface
