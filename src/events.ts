let subscriptions = {};

interface EventHandlerEvent<BodyType = any> {
  target: string;
  id: string;
  name: string;
  body: BodyType;
  time: number;
  delay: number;
  attempt?: number;
}

interface HandlerContext {
  setTimeout(ms: number): void;
}

interface EventHandlerFunction<T = any> {
  (event: EventHandlerEvent<T>, context: HandlerContext): void;
}

type StringNumberDate = string | number | Date;

interface Handler {
  name: string;
  callbacks: Array<Function>;
  timeout: Number;
  push(handler: Function): void;
  setTimeout(ms: Number): void;
  invoke(event: any, context: any): Promise<any[]>;
}

export const events = {
  on: <T>(
    event: string,
    callbackOrConfig: EventHandlerFunction<T> | { timeout: number },
    callback?: EventHandlerFunction<T>
  ): Handler | null => {
    if (!subscriptions[event]) {
      subscriptions[event] = [];
    }

    const callbackFn = callback || callbackOrConfig;
    subscriptions[event].push(callbackFn);
    return null;
  },
  publish: async (
    name: string,
    eventOrConfig: { after: StringNumberDate } | any,
    event?: any
  ) => {
    const body = event || eventOrConfig;
    if (!subscriptions[name]) {
      return;
    }
    await Promise.all(
      (subscriptions[name] || []).map(async (callback) => {
        return await callback({ name, body });
      })
    );
  },
  reset: () => {
    subscriptions = {};
  },
};
