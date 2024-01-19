
class EventEmitter {
  constructor() {
    this.events = {};

    this.id = Date.now();
    console.log('[EventEmitter] id', this.id);
  }

  on(eventName, listener) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(listener);
  }

  emit(eventName, ...args) {
    const listeners = this.events[eventName];
    if (listeners) {
      for (const listener of listeners) {
        listener(...args);
      }
    }
  }

  off(eventName, listener) {
    const listeners = this.events[eventName];
    if (listeners) {
      this.events[eventName] = listeners.filter(fn => fn !== listener);
    }
  }
}

export default new EventEmitter();

/*

// Example usage:
import localEmitter from './utils/EventEmitter';

// Subscribe to an event
localEmitter.on('myEvent', (arg) => {
  console.log('Event emitted with argument:', arg);
});

// Emit the event
localEmitter.emit('myEvent', 'Hello, Event Emitter!');


// Unsubscribe from the event
const myListener = (arg) => {
  console.log('Another listener with argument:', arg);
};

localEmitter.on('myEvent', myListener);

// Emit the event again
localEmitter.emit('myEvent', 'Another hello!');

// Unsubscribe the specific listener
localEmitter.off('myEvent', myListener);

// Emit the event once more
localEmitter.emit('myEvent', 'Final hello!');

*/