import test from 'ava';
import vueInject from '../src';

test.beforeEach(function (t) {
  let injector = vueInject.extend();

  t.context = {injector};
});

test('factory is register.factory alias', function (t) {
  let {injector} = t.context;
  t.is(injector.factory, injector.register.factory);
});
test('registers a factory', function (t) {
  let {injector} = t.context;
  injector.factory('foo', () => 'oof');

  t.is(injector.get('foo'), 'oof');
});

test('service is register.service alias', function (t) {
  let {injector} = t.context;
  t.is(injector.service, injector.register.service);
});
test('registers a service', function (t) {
  let {injector} = t.context;
  injector.service('foo', function () {
    this.foo = 'foo';
  });

  t.is(injector.get('foo').foo, 'foo');
});

test('constant is register.constant alias', function (t) {
  let {injector} = t.context;
  t.is(injector.constant, injector.register.constant);
});
test('registers a constant', function (t) {
  let {injector} = t.context;
  injector.constant('foo', 'foo');

  t.is(injector.get('foo'), 'foo');
});

test('decorator is register.decorator alias', function (t) {
  let {injector} = t.context;
  t.is(injector.decorator, injector.register.decorator);
});
test('registers a decorator', function (t) {
  let {injector} = t.context;
  injector.factory('factory', () => 'simple');
  injector.decorator('factory', factory => factory.split('').reverse().join(''));

  t.is(injector.get('factory'), 'elpmis');
});
