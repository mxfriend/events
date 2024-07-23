import { AsyncEvent } from './asyncEvent';
import type { Event } from './event';
import { HandlerMap } from './handlerMap';
import type { DefaultWrapper, EventConstructor, EventHandler } from './types';
import { isDefaultWrapper } from './types';

export class EventEmitter<Events extends Event> {
  readonly #events: Map<EventConstructor<any>, HandlerMap<any>> = new Map();

  on<E extends Events>(
    event: EventConstructor<E> | DefaultWrapper<E>,
    handler: EventHandler<E>,
  ): void {
    if (isDefaultWrapper(event)) {
      this.getHandlerMap(event.event).default = handler;
    } else {
      this.getHandlerMap(event).add(handler);
    }
  }

  once<E extends Events>(event: EventConstructor<E>, handler: EventHandler<E>): void {
    const wrapped: EventHandler<E> = (evt) => {
      this.off(event, handler);
      handler(evt);
    };

    this.getHandlerMap(event).add(wrapped, handler);
  }

  off<E extends Events>(
    event?: EventConstructor<E> | DefaultWrapper<E>,
    handler?: EventHandler<E>,
  ): void {
    if (!event) {
      return this.#events.clear();
    }

    const [default_, evt] = isDefaultWrapper(event) ? [true, event.event] : [false, event];
    const handlers = this.#events.get(evt) as HandlerMap<E> | undefined;

    if (!handlers) {
      return;
    }

    if (default_) {
      if (!handler || handler === handlers.default) {
        handlers.default = undefined;
      }
    } else if (handler) {
      handlers.delete(handler);
    } else {
      handlers.clear();
    }

    if (!handlers.size && !handlers.default) {
      this.#events.delete(evt);
    }
  }

  emit<E extends Extract<Events, AsyncEvent>>(event: E): Promise<E>;
  emit<E extends Exclude<Events, AsyncEvent>>(event: E): E;
  emit<E extends Events>(event: E): Promise<E> | E {
    const handlers = this.#events.get(event.constructor as EventConstructor<E>);

    if (!handlers) {
      return event instanceof AsyncEvent ? event.resolve() : event;
    }

    if (event instanceof AsyncEvent) {
      return this.emitAsync(event, handlers);
    }

    for (const handler of handlers) {
      handler(event);
      event.setHandled();
    }

    if (handlers.default && !event.isDefaultPrevented()) {
      handlers.default(event);
    }

    return event;
  }

  private async emitAsync<E extends Extract<Events, AsyncEvent>>(
    event: E,
    handlers: HandlerMap<E>,
  ): Promise<E> {
    for (const handler of handlers) {
      await handler(event);
      event.setHandled();
    }

    if (handlers.default && !event.isDefaultPrevented()) {
      await handlers.default(event);
    }

    return event.resolve();
  }

  private getHandlerMap<E extends Events>(event: EventConstructor<E>): HandlerMap<E> {
    let handlers = this.#events.get(event);

    if (!handlers) {
      handlers = new HandlerMap();
      this.#events.set(event, handlers);
    }

    return handlers as any;
  }
}
