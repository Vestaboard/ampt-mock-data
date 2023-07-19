import {
  AddResponse,
  Data,
  DataEventHandler,
  GetBatchResponse,
  GetResponse,
  ListenerPath,
  Query,
  ScanResponse,
  SetBatchResponse,
  SetResponse,
  addOptions,
  getOptions,
  labels,
  scanOptions,
  setBatchOptions,
  setOptions,
} from "@ampt/data";

let store = {
  root: {},
  label1: {},
  label2: {},
  label3: {},
  label4: {},
  label5: {},
};

export const data: Data = {
  get: async function <T>(
    keys: Query | string[] | string,
    options?: boolean | getOptions | undefined
  ): Promise<GetBatchResponse<T> | GetResponse<T>> {
    // Query
    if (typeof keys === "string" && keys.includes("*")) {
      const query = keys.replace("*", "");

      const items = Object.keys(store.root)
        .filter((key) => key.includes(query))
        .map((key) => {
          return {
            key,
            value: store.root[key],
          };
        });

      return {
        items,
      } as GetBatchResponse<T>;
    }

    // Single get
    if (typeof keys === "string") {
      return store.root[keys] as GetResponse<T>;
    }

    // Batch get
    return {
      items: keys.map((key) => {
        return {
          key,
          value: store.root[key],
        };
      }),
    } as GetBatchResponse<T>;
  },
  getByLabel: function <T>(
    label: labels,
    keys: Query | string[],
    options?: boolean | getOptions | undefined
  ): Promise<GetBatchResponse<T>> {
    throw new Error("Function not implemented.");
  },
  scan: function <T>(options: boolean | scanOptions): Promise<ScanResponse<T>> {
    throw new Error("Function not implemented.");
  },
  seed: async function (
    data: string | any[],
    options?: boolean | { overwrite?: boolean | undefined } | undefined
  ): Promise<{ items: number }> {
    throw new Error("Function not implemented.");
  },
  remove: async function (keys: string | string[]): Promise<boolean> {
    if (typeof keys === "string") {
      delete store.root[keys];
    } else {
      keys.forEach((key) => {
        delete store.root[key];
      });
    }
    return true;
  },
  add: function <T>(
    key: string,
    attribute: number | string,
    value?: number | addOptions | boolean,
    opts?: addOptions | boolean
  ): Promise<AddResponse<T>> {
    throw new Error("Function not implemented.");
  },
  on: function (
    name: ListenerPath | ListenerPath[],
    ...handler: [{ timeout: number }, DataEventHandler] | [DataEventHandler]
  ): void {
    throw new Error("Function not implemented.");
  },
  set: async function <T>(
    keys: any[] | string,
    value?: any | setBatchOptions | boolean,
    opts?: undefined | setOptions
  ): Promise<SetBatchResponse<T> | SetResponse<T> | T> {
    // Single Set
    if (typeof keys === "string") {
      store.root[keys] = value;

      return value as SetResponse<T>;
    }
    throw new Error("Function not implemented.");
  },
};
