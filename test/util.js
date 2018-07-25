const Emitter = require('../Emitter');

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

class InheritingEmitter extends Emitter {
  constructor() {
    super();
    this.spy = Spy();
  }

  registerSpy(eventName) {
    this.on(eventName, this.spy.fn);
  }

  unregisterSpy(eventName) {
    this.remove(eventName, this.spy.fn);
  }
}

module.exports = {
  InheritingEmitter,
  Spy,
};
