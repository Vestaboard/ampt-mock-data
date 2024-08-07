interface EventHandlerEvent<BodyType = any> {
  target: string;
  id: string;
  name: string;
  body: BodyType;
  time: number;
  delay: number;
  attempt?: number;
}

declare interface TaskContext {
  setTimeout(ms: number): void;
  progress(message: string, percent: number): void;
}

declare interface TaskEvent<T> extends EventHandlerEvent<T> {}

declare interface TaskHandler<BodyType = any> {
  (event: TaskEvent<BodyType>, context: TaskContext): Promise<any>;
}

interface ITaskOptions {
  timeout?: number;
  attempts?: number;
}

export const task = (
  taskName: string,
  handlerOrOptions: ITaskOptions | TaskHandler,
  handler?: TaskHandler
) => {
  return {
    run: async (expressionOrInput: string | any, input?: any) => {
      const fn = handler || (handlerOrOptions as TaskHandler);
      return await fn(
        {
          delay: 0,
          id: new Date().getTime().toString(),
          name: taskName,
          target: taskName,
          time: new Date().getTime(),
          body: input || expressionOrInput,
        },
        {
          setTimeout: (ms: number) => {},
          progress: (message: string, percent: number) => {},
        }
      );
    },
    every: (interval: string, input?: any) => {},
    cron: (expression: string, input?: any) => {},
  };
};

task.status = (executionId: string) => {
  return {};
};
