import test from 'ava';
import Sinon from 'sinon';
import Vue from './vue';
import vueInject from '../src';

test.beforeEach(function (t) {
  let vue = Vue();
  let injector = vueInject.extend();
  let sinon = Sinon.sandbox.create();

  injector.factory('factory', () => 'resolved!');

  t.context = {vue, injector, sinon};
});

test('applies a vue mixin', function (t) {
  let {injector, vue, sinon} = t.context;

  sinon.stub(vue, 'mixin');

  vue.use(injector);

  t.true(vue.mixin.called);
});

test('resolves vue dependencies', function (t) {
  let {injector, vue} = t.context;

  vue.dependencies = ['factory'];

  vue.use(injector);

  t.is(vue.factory, 'resolved!');
});

test('resolves component dependencies', function (t) {
  let {injector, vue} = t.context;

  vue.$options.dependencies = 'factory';

  vue.use(injector);

  t.is(vue.factory, 'resolved!');
});

test('resolves aliases', function (t) {
  let {injector, vue} = t.context;

  vue.dependencies = {alias : 'factory'};

  vue.use(injector);

  t.is(vue.alias, 'resolved!');
});

test('resolves components', function (t) {
  let {injector, vue} = t.context;

  vue.$options.components = {test : 'factory'};

  vue.use(injector, { components: true });

  t.is(vue.$options.components.test, 'resolved!');
});
test('ignores real components', function (t) {
  let {injector, vue} = t.context;
  let real = {template : '<div></div>'};

  vue.$options.components = {real, fake : 'factory'};

  vue.use(injector, { components: true });

  t.is(vue.$options.components.real, real);
  t.is(vue.$options.components.fake, 'resolved!');
});

test('resolves mixins', function (t) {
  let {injector, vue} = t.context;

  vue.$options.mixins = {factory : 'factory'};

  vue.use(injector, { mixins: true });

  t.is(vue.$options.mixins.factory, 'resolved!');
});

test('resolves directives', function (t) {
  let {injector, vue} = t.context;

  vue.$options.directives = {factory : 'factory'};

  vue.use(injector, { directives: true });

  t.is(vue.$options.directives.factory, 'resolved!');
});

test('has $context constant', function (t) {
  let {injector, vue} = t.context;

  vue.dependencies = {self : '$context'};

  vue.use(injector);

  t.is(vue.self, vue);
});

test('resolves factories as singletons', function (t) {
  let {injector, vue} = t.context;

  injector.factory('factory', () => ({}));

  vue.dependencies = {a : 'factory', b : 'factory'};

  vue.use(injector);

  t.not(vue.a, undefined);
  t.is(vue.a, vue.b);

  const vue2 = Vue();
  vue2.dependencies = {a : 'factory', b : 'factory'};

  vue2.use(injector);

  t.is(vue2.a, vue.a);
  t.is(vue2.b, vue.a);
});

test('sets option merging strategies', function (t) {
  let {injector, vue} = t.context;

  vue.use(injector);

  t.is(typeof vue.config.optionMergeStrategies.dependencies, 'function');

  const merged = vue.config.optionMergeStrategies.dependencies(['apple'], { banana: 'b'});

  t.deepEqual(merged, [ 'apple', { banana: 'b'}]);
});

// strict
test('strict throws when a dep is not found', function (t) {
  let {injector, vue} = t.context;

  vue.dependencies = 'foofactory';

  t.throws(() => vue.use(injector));
  t.throws(() => injector.get('foofactory'));
});
test('non-strict does not throw for missing deps', function (t) {
  let {injector, vue} = t.context;

  vue.dependencies = 'foofactory';
  injector.strict = false;

  t.notThrows(() => vue.use(injector));
  t.throws(() => injector.get('foofactory'));
});
