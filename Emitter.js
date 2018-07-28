const addPrefix = eventName => `__EVENT_${eventName}`;

class Emitter {
  constructor() {
    this.events = {};
  }

  emit(eventName, ...args) {
    const listeners = this.listeners(eventName);
    const errors = [];
    listeners.forEach((event) => {
      try {
        if (event.once) this.remove(eventName, event.fn);
        event.fn.apply(this, args);
      } catch (err) {
        errors.push(err.message);
      }
    });

    if (errors.length > 0) {
      throw new Error(`Event ${eventName} threw the following errors: ${errors.join(' | ')}`);
    }
  }

  listeners(eventName) {
    return this.events[addPrefix(eventName)] || [];
  }

  registerEvent(eventName, fn, once = false) {
    const newEvent = { fn, once };
    const listeners = this.listeners(eventName);
    listeners.push(newEvent);
    this.events[addPrefix(eventName)] = listeners;
  }

  on(eventName, fn) {
    this.registerEvent(eventName, fn);
  }

  once(eventName, fn) {
    this.registerEvent(eventName, fn, true);
  }

  remove(eventName, fn) {
    const listeners = this.listeners(eventName);
    const idx = listeners.findIndex(event => event.fn === fn);
    if (idx > -1) listeners.splice(idx, 1);
  }

  removeAll(eventName) {
    if (arguments.length === 0) this.events = {};
    else this.events[addPrefix(eventName)] = [];
  }
}

module.exports = Emitter;
