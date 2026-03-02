import { EventEmitter } from 'events';

// Global singleton for event broadcasting
const eventEmitter = new EventEmitter();

// Increased limit since multiple clients might connect
eventEmitter.setMaxListeners(100);

export const EVENTS = {
    UPDATE: 'update',
};

export default eventEmitter;
