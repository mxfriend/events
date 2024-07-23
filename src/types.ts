import type { AsyncEvent } from './asyncEvent';
import type { Event } from './event';

export type EventHandler<E extends Event = Event> = (
  event: E,
) => E extends AsyncEvent ? Promise<void> | void : void;

export type EventConstructor<E extends Event = Event> = {
  new (...args: any): E;
};

export type DefaultWrapper<E extends Event = Event> = {
  event: EventConstructor<E>;
};

export function isDefaultWrapper<E extends Event = Event>(
  event: EventConstructor<E> | DefaultWrapper<E>,
): event is DefaultWrapper<E> {
  return typeof event === 'object' && 'event' in event;
}
