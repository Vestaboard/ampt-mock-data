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
    // Get by label
    if (typeof options !== "boolean" && options?.label) {
      return this.getByLabel(options.label, keys, options);
    }

    // Query
    if (typeof keys === "string" && keys.includes("*")) {
      const query = keys.replace("*", "");

      let afterStart = false;

      const itemKeys =
        typeof options !== "boolean" && options?.reverse
          ? Object.keys(store.root).reverse()
          : Object.keys(store.root);

      const items = itemKeys
        .filter((key) => key.includes(query))
        .filter((key) => {
          if (typeof options !== "boolean" && options?.start) {
            if (key === options.start) {
              afterStart = true;
              return false;
            }
            return afterStart;
          }
          return true;
        })
        .filter((_key, index) => {
          if (typeof options !== "boolean" && options?.limit) {
            return index < options.limit;
          }
          return true;
        })
        .map((key) => {
          return {
            key,
            value: store.root[key],
          };
        });

      return {
        items,
        lastKey: items[items.length - 1]?.key ?? null,
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
  getByLabel: async function <T>(
    label: labels,
    keys: Query | string[],
    options?: boolean | getOptions | undefined
  ): Promise<GetBatchResponse<T> | GetResponse<T>> {
    // Query
    if (typeof keys === "string" && keys.includes("*")) {
      const query = keys.replace("*", "");

      let afterStart = false;

      const itemKeys =
        typeof options !== "boolean" && options?.reverse
          ? Object.keys(store[label]).reverse()
          : Object.keys(store[label]);

      const items = itemKeys
        .filter((key) => key.includes(query))
        .filter((key) => {
          if (typeof options !== "boolean" && options?.start) {
            if (key === options.start) {
              afterStart = true;
              return false;
            }
            return afterStart;
          }
          return true;
        })
        .filter((_key, index) => {
          if (typeof options !== "boolean" && options?.limit) {
            return index < options.limit;
          }
          return true;
        })
        .map((key) => {
          return {
            key,
            value: store[label][key],
          };
        });

      return {
        items,
        lastKey: items[items.length - 1]?.key || null,
      } as GetBatchResponse<T>;
    }

    // Single get
    if (typeof keys === "string") {
      return store[label][keys] as GetResponse<T>;
    }

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

      if (typeof opts?.label1 === "string") {
        store.label1[opts.label1] = value;
      }

      if (typeof opts?.label2 === "string") {
        store.label1[opts.label2] = value;
      }

      if (typeof opts?.label3 === "string") {
        store.label1[opts.label3] = value;
      }

      if (typeof opts?.label4 === "string") {
        store.label1[opts.label4] = value;
      }

      if (typeof opts?.label5 === "string") {
        store.label1[opts.label5] = value;
      }

      return value as SetResponse<T>;
    }
    throw new Error("Function not implemented.");
  },
};
