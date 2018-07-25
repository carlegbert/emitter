class Emitter {
  constructor() {
    this.events = {};
  }

  emit(eventName, ...args) {
    const eventArray = this.events[eventName];
    if (!eventArray) return;
    eventArray.forEach(event => event.fn(...args));
    this.events[eventName] = eventArray.filter(event => !event.once);
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
}

module.exports = Emitter;
