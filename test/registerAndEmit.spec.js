const test = require('ava');

const Emitter = require('../Emitter');
const { Spy } = require('./util');

test('successfully registers an event registered with #on', (t) => {
  const e = new Emitter();
  const fn = () => {};
  e.on('testEvent', fn);
  t.truthy(e.events.testEvent);
  t.is(e.events.testEvent.length, 1);
  t.is(e.events.testEvent[0].fn, fn);
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
  t.truthy(e.events.testEvent);
  t.is(e.events.testEvent.length, 1);
  t.is(e.events.testEvent[0].fn, fn);
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
  t.is(e.events.testEvent.length, 0);
});
