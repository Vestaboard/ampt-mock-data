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
  labels: {},
};

export const reset = () => {
  store = {
    root: {},
    label1: {},
    label2: {},
    label3: {},
    label4: {},
    label5: {},
    labels: {},
  };
};

const labelKeys = ["label1", "label2", "label3", "label4", "label5"];

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
    keys: Query | string[] | string,
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
      return {
        items: [
          {
            key: keys,
            value: store[label][keys],
          },
        ],
        lastKey: null,
      } as GetBatchResponse<T>;
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

      if (store.labels[keys]) {
        labelKeys.forEach((labelKey) => {
          if (store.labels[keys][labelKey]) {
            delete store[labelKey][store.labels[keys][labelKey]];
          }
        });
      }
    } else {
      keys.forEach((key) => {
        delete store.root[key];

        if (store.labels[key]) {
          labelKeys.forEach((labelKey) => {
            if (store.labels[key][labelKey]) {
              delete store[labelKey][store.labels[key][labelKey]];
            }
          });
        }
      });
    }
    return true;
  },
  add: async function <T>(
    key: string,
    attribute: number | string,
    value?: number | addOptions | boolean,
    opts?: addOptions | boolean
  ): Promise<AddResponse<T>> {
    let existingItem = await this.get(key);

    if (typeof attribute === "string") {
      existingItem[attribute] = existingItem[attribute] + value;
    } else {
      existingItem = existingItem + attribute;
    }

    return (await this.set(key, existingItem)) as T;
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

      labelKeys.forEach((labelKey) => {
        if (typeof opts?.[labelKey] === "string") {
          store[labelKey][opts[labelKey]] = value;
          store.labels[keys] = store.labels[keys] || {};
          store.labels[keys][labelKey] = opts[labelKey];
        }
      });

      return value as SetResponse<T>;
    }
    throw new Error("Function not implemented.");
  },
};
