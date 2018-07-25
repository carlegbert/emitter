class Emitter {
  constructor() {
    this.events = {};
  }

  emit(eventName) {
    this.events[eventName]();
  }

  on(eventName, fn) {
    this.events[eventName] = fn;
  }
}

module.exports = Emitter;
