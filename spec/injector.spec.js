import test from 'ava';
import vueInject from '../src';

test.beforeEach(function (t) {
  let injector = vueInject.extend();

  t.context = {injector};
});

// get
test('get is an alias for $resolve', function (t) {
  let {injector} = t.context;

  t.is(injector.get, injector.$resolve);
});
test('get resolves dependencies', function (t) {
  let {injector} = t.context;

  injector.register.factory('myFactory', () => 'foo');
  let resolved = injector.get('myFactory');

  t.is(resolved, 'foo');
});
test('uses named dependencies', function (t) {
  let {injector} = t.context;

  let resolved = injector.get('named', {named : 'bah'});

  t.is(resolved, 'bah');
});
test('has jpex-web factories', function (t) {
  let {injector} = t.context;

  let $promise = injector.get('$promise');

  return $promise(resolve => { resolve(); });
});

// reset
test('reset deletes all registered services', function (t) {
  let {injector} = t.context;

  injector.factory('myFactory', () => 'foo');

  t.notThrows(() => injector.get('myFactory'));
  t.notThrows(() => injector.get('$promise'));

  injector.reset();

  t.throws(() => injector.get('myFactory'));
  t.notThrows(() => injector.get('$promise'));
});

// spawn
test('spawn creates a new injector', function (t) {
  let {injector} = t.context;
  let i2 = injector.spawn();

  t.not(i2, undefined);
  t.not(i2.get, undefined);
  t.not(i2.reset, undefined);
});
test('spawn does not share parent factories', function (t) {
  let {injector} = t.context;
  injector.factory('myFactory', () => 'foo');

  let i2 = injector.spawn();

  t.notThrows(() => injector.get('myFactory'));
  t.throws(() => i2.get('myFactory'));
});
test('spawn inherits parent factories if true', function (t) {
  let {injector} = t.context;
  injector.factory('myFactory', () => 'foo');

  let i2 = injector.spawn(true);

  t.notThrows(() => injector.get('myFactory'));
  t.notThrows(() => i2.get('myFactory'));
});

// clearCache
test('clearCache clears the cache', function (t) {
  let {injector} = t.context;
  injector.factory('myFactory', () => ({}));

  let a = injector.get('myFactory');
  let b = injector.get('myFactory');

  // clear a specific factory
  injector.clearCache('myService');

  let c = injector.get('myFactory');

  // clear all factories
  injector.clearCache();

  let d = injector.get('myFactory');

  t.is(a, b);
  t.is(a, c);
  t.not(a, d);
});
