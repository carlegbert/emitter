const test = require('ava');

const Emitter = require('./Emitter');

const Spy = () => {
  let count = 0;
  return {
    count: () => count,
    fn: () => { count += 1; },
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
