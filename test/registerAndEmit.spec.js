const test = require('ava');

const Emitter = require('../Emitter');
const { InheritingEmitter, Spy } = require('./util');

test('successfully registers an event registered with #on', (t) => {
  const e = new Emitter();
  const fn = () => {};
  e.on('testEvent', fn);
  t.truthy(e.listeners('testEvent'));
  t.is(e.listeners('testEvent').length, 1);
  t.is(e.listeners('testEvent')[0].fn, fn);
});

test('successfully emits an event registered with #on', (t) => {
  const e = new Emitter();
  const spy = Spy();
  e.on('testEvent', spy.fn);
  e.emit('testEvent');
  t.is(spy.count(), 1);
});

test('successfully emits an event with an argument', (t) => {
  const e = new Emitter();
  const spy = Spy();
  e.on('testEvent', spy.fn);
  e.emit('testEvent', 'test argument');
  const lastArgs = spy.lastArgs();
  t.is(spy.count(), 1);
  t.is(lastArgs.length, 1);
  t.is(lastArgs[0], 'test argument');
});

test('emits with no registered events without an error', (t) => {
  const e = new Emitter();
  try {
    e.emit('unregisteredEvent');
    t.pass();
  } catch (err) {
    t.fail(err.message);
  }
});

test('successfully emits an event with multiple arguments', (t) => {
  const e = new Emitter();
  const spy = Spy();
  e.on('testEvent', spy.fn);
  e.emit('testEvent', 'arg1', 'arg2');
  const lastArgs = spy.lastArgs();
  t.is(spy.count(), 1);
  t.is(lastArgs.length, 2);
  t.is(lastArgs[0], 'arg1');
  t.is(lastArgs[1], 'arg2');
});

test('successfully registers an event with #once', (t) => {
  const e = new Emitter();
  const fn = () => {};
  e.once('testEvent', fn);
  t.truthy(e.listeners('testEvent'));
  t.is(e.listeners('testEvent').length, 1);
  t.is(e.listeners('testEvent')[0].fn, fn);
});

test('successfully emits an event registered with #once', (t) => {
  const e = new Emitter();
  const spy = Spy();
  e.once('testEvent', spy.fn);
  e.emit('testEvent');
  t.is(spy.count(), 1);
});

test('only emits an event registered with #once once', (t) => {
  const e = new Emitter();
  const spy = Spy();
  e.once('testEvent', spy.fn);
  e.emit('testEvent');
  e.emit('testEvent');
  t.is(spy.count(), 1);
});

test('can register multiple listeners at a single event name', (t) => {
  const e = new Emitter();
  const spy1 = Spy();
  const spy2 = Spy();
  e.on('testEvent', spy1.fn);
  e.emit('testEvent');
  e.on('testEvent', spy2.fn);
  e.emit('testEvent');
  t.is(spy1.count(), 2);
  t.is(spy2.count(), 1);
});

test('can register multiple listeners and pass them all args', (t) => {
  const e = new Emitter();
  const spy1 = Spy();
  const spy2 = Spy();
  e.on('testEvent', spy1.fn);
  e.emit('testEvent');
  e.on('testEvent', spy2.fn);
  e.emit('testEvent', 'test_args');
  t.is(spy1.count(), 2);
  t.is(spy2.count(), 1);
  t.is(spy1.lastArgs()[0], 'test_args');
});

test('can register both #on and #once listeners at the same name', (t) => {
  const e = new Emitter();
  const spy1 = Spy();
  const spy2 = Spy();
  e.on('testEvent', spy1.fn);
  e.once('testEvent', spy2.fn);
  e.emit('testEvent');
  e.emit('testEvent');
  t.is(spy1.count(), 2);
  t.is(spy2.count(), 1);
});

test('will continue to emit if an event throws an exception', (t) => {
  const e = new Emitter();
  const throwingFn = () => { throw new Error('I am a very bad function.'); };
  const spy = Spy();
  e.on('testEvent', throwingFn);
  e.on('testEvent', spy.fn);
  t.throws(() => {
    e.emit('testEvent');
  }, /I am a very bad function.$/);
  t.is(spy.count(), 1);
});

test('will remove an event registered with #once even if it throws an error', (t) => {
  const e = new Emitter();
  const throwingFn = () => { throw new Error('I am a very bad function.'); };
  e.once('testEvent', throwingFn);
  t.throws(() => {
    e.emit('testEvent');
  }, /I am a very bad function.$/);
  t.is(e.listeners('testEvent').length, 0);
});

test('registers events when extended', (t) => {
  const e = new InheritingEmitter();
  e.registerSpy('testEvent');
  t.truthy(e.listeners('testEvent'));
  t.is(e.listeners('testEvent').length, 1);
  t.is(e.listeners('testEvent')[0].fn, e.spy.fn);
});

test('emits events when extended', (t) => {
  const e = new InheritingEmitter();
  e.registerSpy('testEvent');
  e.emit('testEvent', 'an_argument');
  t.is(e.spy.count(), 1);
  t.is(e.spy.lastArgs().length, 1);
  t.is(e.spy.lastArgs()[0], 'an_argument');
});

test('removes events when extended', (t) => {
  const e = new InheritingEmitter();
  e.registerSpy('testEvent');
  t.is(e.listeners('testEvent').length, 1);
  e.unregisterSpy('testEvent');
  t.is(e.listeners('testEvent').length, 0);
});

test('Event functions have scope of parent object if that object extends Emitter', (t) => {
  const e = new InheritingEmitter();
  e.on('testEvent', e.updateOwnProperty);
  e.emit('testEvent', 'updated!');
  t.is(e.objectProperty, 'updated!');
  t.falsy(e.listeners('testEvent')[0].objectProperty);
});

test('Bound event handlers keep the scope that they are bound to', (t) => {
  const e = new Emitter();
  const obj1 = {
    fn() {
      this.fnCalledByMe = true;
    },
  };
  const obj2 = {};
  e.on('testEvent', obj1.fn.bind(obj2));
  e.emit('testEvent');
  t.truthy(obj2.fnCalledByMe);
  t.falsy(obj1.fnCalledByMe);
  t.falsy(e.fnCalledByMe);
  t.falsy(e.listeners('testEvent')[0].fnCalledByMe);
});

test('Names corresponding with object.prototype functions such as `constructor` can be used as event names', (t) => {
  const e = new Emitter();
  const spy = Spy();
  e.on('constructor', spy.fn);
  e.on('toString', spy.fn);
  e.emit('constructor');
  e.emit('toString');
  t.is(spy.count(), 2);
});

test('Works when emit is called in event handlers', (t) => {
  const e = new Emitter();
  const spy = Spy();
  const nestedEmit = arg => e.emit('nestedEmit', arg);
  e.on('outerEmit', nestedEmit);
  e.on('nestedEmit', spy.fn);
  e.emit('outerEmit', 'arg');
  t.is(spy.count(), 1);
  t.is(spy.lastArgs()[0], 'arg');
});
