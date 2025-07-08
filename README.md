[![NPM version][npm-version-image]][npm-url] [![NPM downloads][npm-downloads-image]][npm-url] [![build][build-image]][build-url] [![MIT License][license-image]][license-url] 

# async-event-emitter2
> An EventEmitter that supports serial execution of asynchronous event listeners. It also supports event listeners without callbacks (synchronous), as well as interrupting the call-chain (similar to the DOM's e.stopPropagation()).

Original [async-eventemitter][async-eventemitter-url] package by [Andreas Hultgren][ahultgren-url] wasn't updated for several years now and this is an effort to support newer versions.

## Example
```js
const AsyncEventEmitter2 = require('async-event-emitter2');
const events = new AsyncEventEmitter2();

events.on('test', (e, next) => {
  // The next event listener will wait til this is done
  setTimeout(next, 1000);
});

events
  .on('test', (e) => {
    // This is a synchronous event listener (note the lack of a second callback argument)
    console.log(e);
    // { data: 'data' }
  })
  .on('test', (e, next) => {
    // Even if you're not truly asynchronous you can use next() to stop propagation
    next(new Error('You shall not pass'));
  });

events.emit('test', { data: 'data' }, (err) => {
  // This is run after all of the event listeners are done
  console.log(err);
  // [Error: You shall not pass]
});
```
More examples are found in the `test`-folder.

## Important differences between AsyncEventEmitter the native EventEmitter
The API and behavior of AsyncEventEmitter is as far as possible and meaningful identical to that of the native EventEmitter. However there are some important differences which should be noted.

* Data sent to event listeners (`e.g. emit(data)`) must always be **zero** or **one** argument, and can *not* be a function.
* Event listeners will always receive the data object, which may or may not be undefined.
* The second argument can only be a callback, and will only be supplied if the event listener has an arity of two or more (e.g. `function(e, next){}`).
* Event listeners with an arity of one or zero (e.g. without a callback argument specified) will be treated as synchronous.
* Even if all event listeners are synchronous, they will still be executed asynchronously (through setImmediate) and thus code succeeding `.emit()` will be executed before any event listeners.
* Interrupt the callback chain in async listeners by calling the callback with the error as the first parameter; in sync listeners by throwing an Error.

## Usage
### Unchanged
For `addListener() on() once() removeListener() removeAllListeners() setMaxListeners() listeners()` see the [EventEmitter docs][eventemitter-url], nothing new here.

### `emit(event, [data], [callback])`
Executes all listeners for the event in order with the supplied data argument. The optional callback is called when all of the listeners are done.

### `.first(event, new)`
Adds a listener to the beginning of the listeners array for the specified event.

### `.at(event, index, listener)`
Adds a listener at the specified index in the listeners array for the specified event.

### `.before(event, target, listener)`
Adds a listener before the target listener in the listeners array for the specified event.

### `.after(event, target, listener)`
Adds a listener after the target listener in the listeners array for the specified event.

## Contribution
1. Create an issue and tell me what you're gonna do, just to make sure there's no duplicate work.
2. Fork and branch your feature-branch of the develop branch.
3. Write tests for changed/added functionality and make sure you don't break existing ones.
4. Adhere to existing code style.
5. Submit a pull-request to the develop branch.

## License
async-event-emitter2 is released under the MIT License.

[npm-url]: https://npmjs.org/package/async-event-emitter2
[npm-version-image]: https://img.shields.io/npm/v/async-event-emitter2.svg?style=flat
[npm-downloads-image]: http://img.shields.io/npm/dm/async-event-emitter2.svg?style=flat

[build-url]: https://github.com/PantelisGeorgiadis/async-event-emitter2/actions/workflows/build.yml
[build-image]: https://github.com/PantelisGeorgiadis/async-event-emitter2/actions/workflows/build.yml/badge.svg?branch=master

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE.txt

[async-eventemitter-url]: https://github.com/ahultgren/async-eventemitter
[ahultgren-url]: https://github.com/ahultgren
[eventemitter-url]: http://nodejs.org/api/events.html
