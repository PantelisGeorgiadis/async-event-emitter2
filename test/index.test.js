const AsyncEventEmitter2 = require('./../src/index');

const chai = require('chai');
const expect = chai.expect;

describe('An instance', () => {
  it('should be created', () => {
    events = new AsyncEventEmitter2();
  });
});

describe('on()', () => {
  function listener1(e, callback) {
    expect(this).to.be.eq(events);

    setTimeout(() => {
      i++;
      expect(typeof e).to.be.eq('object');
      expect(typeof callback).to.be.eq('function');

      callback();
    });
  }

  function listener2(e, callback) {
    expect(this).to.be.eq(events);

    setTimeout(() => {
      i++;
      expect(typeof e).to.be.eq('object');
      expect(typeof callback).to.be.eq('function');

      callback();
    });
  }

  it('should register an eventlistener', (done) => {
    events.on('test1', listener1);
    events.on('test1', listener2);

    expect(events._events).to.have.property('test1');
    done();
  });
});

describe('emit()', () => {
  it('should emit event and call callback after all eventListeners are done', (done) => {
    i = 0;
    events.emit('test1', {}, (err) => {
      expect(i).to.be.eq(2);
      done();
    });
  });

  it('should emit with no argument', (done) => {
    events.on('no-arg', (e, next) => {
      expect(e).to.be.undefined;
      next();
      done();
    });

    events.emit('no-arg');
  });

  it('should emit with only data argument', (done) => {
    events.on('data-only', (e, next) => {
      expect(e).to.be.eq(1);
      next();
      done();
    });

    events.emit('data-only', 1);
  });

  it('should emit with only callback argument', (done) => {
    events.on('function-only', (e, next) => {
      expect(e).to.be.undefined;
      next();
    });

    events.emit('function-only', done);
  });
});

describe('eventListeners', () => {
  it('should be synchronous if no next-argument specified', (done) => {
    events.on('sync', (e) => {
      expect(e).to.be.eq(1);
    });

    events.emit('sync', 1, done);
  });
});

describe('next(err)', () => {
  it('should abort the callback chain', (done) => {
    events.on('err', (e, next) => {
      next(1);
    });

    events.on('err', (e, next) => {
      throw 'Expected this function to not be called';
    });

    events.emit('err', (err) => {
      expect(err).to.be.eq(1);
      done();
    });
  });
});

describe('newListener-events', () => {
  const events = new AsyncEventEmitter2();

  it('should supply the event listener as e and not next', (done) => {
    function newListener(e) {
      expect(e).to.have.property('event');
      expect(e.event).to.be.eq('newListener-test');

      expect(e).to.have.property('fn');
      expect(e.fn).to.be.eq(test);

      done();
    }

    function test() {}

    events.on('newListener', newListener);
    events.on('newListener-test', test);
  });
});

describe('removeListener-events', () => {
  const events = new AsyncEventEmitter2();

  it('should supply the event listener as e and not next', (done) => {
    function removeListener(e) {
      expect(e).to.have.property('event');
      expect(e.event).to.be.eq('test');

      expect(e).to.have.property('fn');
      expect(e.fn).to.be.eq(test);

      done();
    }

    function test() {}

    events.on('removeListener', removeListener);
    events.on('test', test);
    events.removeListener('test', test);
  });
});

describe('once()', () => {
  let i = 0;

  function listener1(e, callback) {
    setTimeout(() => {
      i++;

      callback();
    });
  }

  it('should register eventListeners', () => {
    events.once('test-once', listener1);

    expect(events._events).to.have.property('test-once');
  });

  describe('eventListeners', () => {
    it('should only be called once', (done) => {
      events.emit('test-once', () => {
        expect(i).to.be.eq(1);

        events.emit('test-once', () => {
          expect(i).to.be.eq(1);

          done();
        });
      });
    });
  });
});

describe('removeAllListeners', () => {
  const events = new AsyncEventEmitter2();
  events.on('test', () => {});
  events.on('test2', () => {});

  describe('(event)', () => {
    it('should remove all event listeners for event', () => {
      expect(events._events).to.have.property('test');
      events.removeAllListeners('test');
      expect(events._events).to.not.have.property('test');
    });
  });

  describe('()', () => {
    it('should remove all event listeners for all events', () => {
      expect(events._events).to.have.property('test2');
      events.removeAllListeners();
      expect(events._events).to.not.have.property('test2');
    });
  });
});

describe('listeners()', () => {
  const events = new AsyncEventEmitter2();

  function test() {}

  events.on('test', test);

  it('should return all listeners for the specified event', () => {
    const listeners = events.listeners('test');

    expect(listeners).to.have.property('length');
    expect(listeners.length).to.be.eq(1);
    expect(listeners[0]).to.be.eq(test);
  });
});

describe('all overridden methods', () => {
  const events = new AsyncEventEmitter2();

  describe('(.on())', () => {
    it('should be chainable', () => {
      expect(events.on('test', () => {})).to.be.instanceOf(AsyncEventEmitter2);
    });
  });

  describe('(.once())', () => {
    it('should be chainable', () => {
      expect(events.once('test', () => {})).to.be.instanceOf(AsyncEventEmitter2);
    });
  });

  describe('(.emit())', () => {
    it('should return a boolean', () => {
      //expect(events.emit('test')).to.be.true;
    });
  });
});

describe('all added methods', () => {
  const events = new AsyncEventEmitter2();

  describe('(.first())', () => {
    it('should be chainable', () => {
      expect(events.first('test', () => {})).to.be.instanceOf(AsyncEventEmitter2);
    });
  });

  describe('(.at())', () => {
    it('should be chainable', () => {
      expect(events.at('test', 1, () => {})).to.be.instanceOf(AsyncEventEmitter2);
    });
  });

  describe('(.before())', () => {
    it('should be chainable', () => {
      expect(
        events.before(
          'test',
          () => {},
          () => {}
        )
      ).to.be.instanceOf(AsyncEventEmitter2);
    });
  });

  describe('(.after())', () => {
    it('should be chainable', () => {
      expect(
        events.after(
          'test',
          () => {},
          () => {}
        )
      ).to.be.instanceOf(AsyncEventEmitter2);
    });
  });
});

describe('first()', () => {
  const events = new AsyncEventEmitter2();

  function test() {}

  it('should add an event listener first in the chain', () => {
    events.on('test', () => {});
    events.first('test', test);

    expect(events._events.test[0]).to.be.eq(test);
    expect(events._events.test.length).to.be.eq(2);
  });
});

describe('at()', () => {
  const events = new AsyncEventEmitter2();

  function test() {}

  it('should insert an event listener at the specified index', () => {
    events.on('test', () => {});
    events.on('test', () => {});
    events.on('test', () => {});
    events.at('test', 2, test);

    expect(events._events.test[2]).to.be.eq(test);
    expect(events._events.test.length).to.be.eq(4);
  });

  it('should push a listener if the index is larger than the length', () => {
    events.at('test', 10, test);

    expect(events._events.test[events._events.test.length - 1]).to.be.eq(test);
    expect(events._events.test.length).to.be.eq(5);
  });
});

describe('before()', () => {
  const events = new AsyncEventEmitter2();

  function target() {}
  function listener() {}

  it('should insert a listener before the specified target', () => {
    events.on('test', () => {});
    events.on('test', target);
    events.before('test', target, listener);

    expect(events._events.test[1]).to.be.eq(listener);
    expect(events._events.test.length).to.be.eq(3);
  });

  it('should push a listener if the target is not found', () => {
    events.on('test2', () => {});
    events.before('test2', target, listener);

    expect(events._events.test2[1]).to.be.eq(listener);
    expect(events._events.test2.length).to.be.eq(2);
  });
});

describe('after()', () => {
  const events = new AsyncEventEmitter2();

  function target() {}
  function listener() {}

  it('should insert a listener after the specified target', () => {
    events.on('test', () => {});
    events.on('test', target);
    events.after('test', target, listener);

    expect(events._events.test[2]).to.be.eq(listener);
    expect(events._events.test.length).to.be.eq(3);
  });

  it('should push a listener if the target is not found', () => {
    events.on('test2', () => {});
    events.after('test2', target, listener);

    expect(events._events.test2[1]).to.be.eq(listener);
    expect(events._events.test2.length).to.be.eq(2);
  });
});

describe('Sync listener returning an Error', () => {
  function err() {
    throw new Error('Die!');
  }

  it('should abort the listener chain', (done) => {
    events.on('errorTest', err);
    events.on('errorTest', () => {
      // Just make sure this is never run
      expect(true).to.be.eq(false);
    });

    events.emit('errorTest', (err) => {
      expect(err).to.be.instanceOf(Error);
      done();
    });
  });
});
