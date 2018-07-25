const test = require('ava');

const Emitter = require('../Emitter');
const { Spy } = require('./util');

test('can remove an event registered with #on', (t) => {
  const e = new Emitter();
  const fn = () => {};
  e.on('testEvent', fn);
  e.remove('testEvent', fn);
  t.is(e.events.testEvent.length, 0);
});

test('can remove an event registered with #once', (t) => {
  const e = new Emitter();
  const fn = () => {};
  e.once('testEvent', fn);
  e.remove('testEvent', fn);
  t.is(e.events.testEvent.length, 0);
});

test('can remove a single event when muliple have been registered', (t) => {
  const e = new Emitter();
  const fn = () => {};
  const otherFn = () => {};
  e.on('testEvent', fn);
  e.on('testEvent', otherFn);
  e.remove('testEvent', fn);
  t.is(e.events.testEvent.length, 1);
  t.truthy(e.events.testEvent.find(event => event.fn === otherFn));
});

test('does nothing if #remove is called for an eventName with no listeners', (t) => {
  const e = new Emitter();
  const fn = () => {};
  t.notThrows(() => {
    e.remove('testEvent', fn);
  }, 'Threw an error attempting to remove a non-registered event');
});

test('does nothing if #remove is called for an eventName with no matching listeners', (t) => {
  const e = new Emitter();
  const fn = () => {};
  const otherFn = () => {};
  e.on('testEvent', otherFn);
  t.notThrows(() => {
    e.remove('testEvent', fn);
  }, 'Threw an error attempting to remove a non-registered event');
});

test('unregistered listeners are not called', (t) => {
  const e = new Emitter();
  const spy = Spy();
  e.on('testEvent', spy.fn);
  e.remove('testEvent', spy.fn);
  e.emit('testEvent');
  t.is(spy.count(), 0);
});

test('removeAll removes all registered listeners at a name', (t) => {
  const e = new Emitter();
  const spy1 = Spy();
  const spy2 = Spy();
  e.on('testEvent', spy1.fn);
  e.once('testEvent', spy2.fn);
  e.removeAll('testEvent');
  e.emit('testEvent');
  t.is(spy1.count(), 0);
  t.is(spy2.count(), 0);
});

test('removeAll removes all registered listeners if no name is supplied', (t) => {
  const e = new Emitter();
  const spy1 = Spy();
  const spy2 = Spy();
  e.on('testEvent', spy1.fn);
  e.once('otherTestEvent', spy2.fn);
  e.removeAll();
  e.emit('testEvent');
  e.emit('otherTestEvent');
  t.is(spy1.count(), 0);
  t.is(spy2.count(), 0);
});

test('events can be registered, emitted, and removed if events have previously been removed for that name', (t) => {
  const e = new Emitter();
  const spy = Spy();
  e.on('testEvent', spy.fn);
  e.removeAll('testEvent');
  e.on('testEvent', spy.fn);
  e.emit('testEvent');
  e.remove('testEvent', spy.fn);
  t.is(spy.count(), 1);
});
