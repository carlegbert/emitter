const test = require('ava');

const Emitter = require('./Emitter');

const Spy = () => {
  let count = 0;
  let lastArgs;
  return {
    count: () => count,
    lastArgs: () => lastArgs,
    fn: (...args) => {
      count += 1;
      lastArgs = args;
    },
  };
};

test('successfully registers an event', (t) => {
  const e = new Emitter();
  e.on('testEvent', () => {});
  t.truthy(e.events.testEvent);
});

test('successfully emits an event', (t) => {
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
