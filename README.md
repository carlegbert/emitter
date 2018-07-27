# Emitter

This is a simple JavaScript event emitter. It can run in node versions 6.0.0 or higher.

## Installation

```sh
$ npm install @carlegbert/emitter
```

## Useage

This module exposes an `Emitter` class. This class can be used to create instances directly:

```js
const Emitter = require('@carlegbert/emitter');

emitter = new Emitter();

```

or subclassed:

```js
class FancyEmitter extends Emitter {
  ...
}

const fancyEmitter = new FancyEmitter();
```

An event handler can be registered at a name with `on`:

```js
const eventHandler = console.log('myEventName happened!');
emitter.on('myEventName', eventHandler);
```

or with 'once', if you would like to register an event that will happen at most one time.

```js
emitter.once('myEventName', () => console.log('myEventName happened! this function only gets called once.'));
```

You can call the registered event handlers by calling `emit`. If there are multiple handlers at an event name, they will be called in the order that they were registered.

```js
emitter.emit('myEventName');
// 'myEventName happened!'
// 'myEventName happened! this function only gets called once.'
```

When you `emit`, you may also supply any number of arguments, which will be passed to all of the emitted functions.

```js
emitter.on('eventWithArgs', x => console.log(x));
emitter.emit('eventWithArgs', 'I was passed to emit');
// 'I was passed to emit'
```

You can remove an event handler by passing the name of the event and a reference to the registered function to `remove`.

```js
emitter.remove('myEventName', eventHandler);
```

You can also remove all event handlers registered at a specific name with 'removeAll'. If want to unregister all event handlers period, you can call `removeAll` without passing it an event name.

```js
// Removes all events at eventName
emitter.removeAll('myEventName');
// Removes all events at any name
emitter.removeAll();
```

### A note about scope

Event handlers will be called with the scope of the Emitter object. If you want your listener to be bound to a different scope, you can use `Function.prototype.bind` to bind your event handler to the scope that you desire, or better yet, use an arrow function.

## API

### `constructor()`

Takes no arguments. Will return an instance of the Emitter class.

### `emit(eventName: String|number, ...args: any)`

Takes an eventName, which ideally should be a string or a number, and any number of additional arguments. Will call all of the event handlers registered at `eventName` and pass them `...args`, in the order they were registered. If any registered handlers throw an error, a new error will be thrown after all registered events have been called.

### `on(eventName: String|number, fn: function)`

Will register `fn` for event `eventName`, to be emitted by `emit`.

### `once(eventName: String|number, fn: function)`

Will register `fn` for event `eventName`, to be emitted by `emit`. Will be unregistered after it has been called once.

### `remove(eventName: String|number, fn: function)`

Will unregister `fn` for event `eventName`, where `fn` is a reference to a function registered at `eventName`. Once unregistered, a handler will no longer be emitted. If there are no events at `eventName`, or if `fn` is not a handler for `eventName`, nothing will happen.

### `removeAll(eventName: String|number)`

Will unregister all events at `eventName`. **If `eventName` is not supplied, ALL events at ALL names will be unregistered.**

### `listeners(eventName: String|number)`

Will get all listeners registered at `eventName` (or any empty array if there are none).
