import type { Event } from './event';
import type { EventHandler } from './types';

export class HandlerMap<E extends Event = Event> {
  public default?: EventHandler<E>;

  readonly #handlers: Map<EventHandler<E>, EventHandler<E>> = new Map();

  add(handler: EventHandler<E>, key: EventHandler<E> = handler): void {
    this.#handlers.set(key, handler);
  }

  delete(handler: EventHandler<E>): void {
    this.#handlers.delete(handler);
  }

  clear(): void {
    this.#handlers.clear();
  }

  get size(): number {
    return this.#handlers.size;
  }

  [Symbol.iterator](): IterableIterator<EventHandler<E>> {
    return this.#handlers.values();
  }
}
