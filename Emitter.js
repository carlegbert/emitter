class Emitter {
  constructor() {
    this.events = {};
  }

  emit(eventName, ...args) {
    const eventArray = this.events[eventName];
    if (!eventArray) return;

    const errors = [];
    eventArray.forEach((event) => {
      try {
        event.fn(...args);
      } catch (err) {
        errors.push(err.message);
      }
    });

    this.events[eventName] = eventArray.filter(event => !event.once);

    if (errors.length > 0) {
      throw new Error(`Event ${eventName} threw the following errors: ${errors.join(' | ')}`);
    }
  }

  registerEvent(eventName, fn, once = false) {
    const newEvent = { fn, once };
    if (this.events[eventName]) this.events[eventName].push(newEvent);
    else this.events[eventName] = [newEvent];
  }

  on(eventName, fn) {
    this.registerEvent(eventName, fn);
  }

  once(eventName, fn) {
    this.registerEvent(eventName, fn, true);
  }

  remove(eventName, fn) {
    const eventsForName = this.events[eventName];
    if (!eventsForName || eventsForName.length === 0) return;
    const idx = eventsForName.findIndex(event => event.fn === fn);
    eventsForName.splice(idx, 1);
  }

  removeAll(eventName) {
    if (arguments.length === 0) this.events = {};
    this.events[eventName] = [];
  }
}

module.exports = Emitter;
