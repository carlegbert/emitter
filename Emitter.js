class Emitter {
  constructor() {
    this.events = {};
  }

  emit(eventName, ...args) {
    const event = this.events[eventName];
    if (!event) return;
    if (event.once) this.events[eventName] = undefined;
    event.fn(...args);
  }

  registerEvent(eventName, fn, once = false) {
    this.events[eventName] = { fn, once };
  }

  on(eventName, fn) {
    this.registerEvent(eventName, fn);
  }

  once(eventName, fn) {
    this.registerEvent(eventName, fn, true);
  }
}

module.exports = Emitter;
