import type { DefaultWrapper, EventConstructor } from './types';

export class Event {
  #defaultPrevented: boolean = false;
  #handled: boolean = false;

  static default<T extends Event>(this: EventConstructor<T>): DefaultWrapper<T> {
    return { event: this };
  }

  preventDefault(): void {
    this.#defaultPrevented = true;
  }

  isDefaultPrevented(): boolean {
    return this.#defaultPrevented;
  }

  setHandled(): void {
    this.#handled = true;
  }

  isHandled(): boolean {
    return this.#handled;
  }
}
