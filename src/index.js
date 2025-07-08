const EventEmitter = require('events');
const eachSeries = require('async/eachSeries');

class AsyncEventEmitter2 extends EventEmitter {
  constructor() {
    super();
  }

  emit(event, data, callback) {
    let listeners = this._events[event] || [];
    listeners = Array.isArray(listeners) ? listeners : [listeners];

    // Optional data argument
    if (!callback && typeof data === 'function') {
      callback = data;
      data = undefined;
    }

    // Special treatment of internal newListener and removeListener events
    if (event === 'newListener' || event === 'removeListener') {
      data = {
        event: data,
        fn: callback,
      };
      callback = undefined;
    }

    eachSeries(
      listeners.slice(),
      (fn, next) => {
        let err;

        // Synchronous functions
        if (fn.length < 2) {
          try {
            fn.call(this, data);
          } catch (e) {
            err = e;
          }

          return next(err);
        }

        // Asynchronous functions
        fn.call(this, data, next);
      },
      callback
    );

    return true;
  }

  once(type, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('listener must be a function');
    }

    const g =
      listener.length >= 2
        ? (e, next) => {
            this.removeListener(type, g);
            listener(e, next);
          }
        : (e) => {
            this.removeListener(type, g);
            listener(e);
          };

    g.listener = listener;

    this.on(type, g);

    return this;
  }

  first(event, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('listener must be a function');
    }

    let listeners = this._events[event] || [];
    if (!Array.isArray(listeners)) {
      this._events[event] = listeners = [listeners];
    }

    listeners.unshift(listener);

    return this;
  }

  at(event, index, listener) {
    if (typeof index !== 'number' || index < 0) {
      throw new TypeError('index must be a non-negative integer');
    }
    if (typeof listener !== 'function') {
      throw new TypeError('listener must be a function');
    }

    let listeners = this._events[event] || [];
    if (!Array.isArray(listeners)) {
      this._events[event] = listeners = [listeners];
    }

    listeners.splice(index, 0, listener);

    return this;
  }

  before(event, target, listener) {
    return this._beforeOrAfter(event, target, listener);
  }

  after(event, target, listener) {
    return this._beforeOrAfter(event, target, listener, 'after');
  }

  _beforeOrAfter(event, target, listener, beforeOrAfter) {
    if (typeof listener !== 'function') {
      throw new TypeError('listener must be a function');
    }

    if (typeof target !== 'function') {
      throw new TypeError('target must be a function');
    }

    let listeners = this._events[event] || [];
    if (!Array.isArray(listeners)) {
      this._events[event] = listeners = [listeners];
    }

    const add = beforeOrAfter === 'after' ? 1 : 0;
    let index = listeners.length;

    for (let i = listeners.length; i--; ) {
      if (listeners[i] === target) {
        index = i + add;
        break;
      }
    }

    listeners.splice(index, 0, listener);

    return this;
  }
}

module.exports = AsyncEventEmitter2;
