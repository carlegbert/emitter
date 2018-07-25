class Emitter {
  constructor() {
    this.events = {};
  }

  emit(eventName, ...args) {
    this.events[eventName](...args);
  }

  on(eventName, fn) {
    this.events[eventName] = fn;
  }
}

module.exports = Emitter;
