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
  subscriptions: {},
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
    subscriptions: {},
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

const emitToSubscribers = (eventType: string, path: string, data: any) => {
  const subscribers = Object.keys(store.subscriptions);

  subscribers
    .filter((subscriber) => {
      const [subscriberType, ...subscriberParts] = subscriber.split(":");

      // Global subscribers
      if (subscriber === "*" || subscriber === eventType) {
        return true;
      }

      // Path subscribers
      if (subscriberType == "*" || subscriberType === eventType) {
        const pathParts = path.split(":");
        return subscriberParts.every((part, index) => {
          if (part === "*") {
            return true;
          }
          return part === pathParts[index];
        });
      }
      return false;
    })
    .forEach((subscriber) => {
      store.subscriptions[subscriber].forEach((fn) =>
        fn({
          item: {
            value: data.item,
          },
          previous: {
            value: data.previous,
          },
          name: data.name,
        })
      );
    });
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
  scan: async function <T>(
    options: boolean | scanOptions
  ): Promise<ScanResponse<T>> {
    let afterStart = false;

    const itemKeys = Object.keys(store.root);

    const items = itemKeys
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
    } as ScanResponse<T>;
  },
  seed: async function (
    data: string | any[],
    options?: boolean | { overwrite?: boolean | undefined } | undefined
  ): Promise<{ items: number }> {
    throw new Error("Function not implemented.");
  },
  remove: async function (keys: string | string[]): Promise<boolean> {
    if (typeof keys === "string") {
      emitToSubscribers("deleted", keys, {
        previous: store.root[keys],
        name: "deleted",
      });
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
        emitToSubscribers("deleted", key, {
          previous: store.root[key],
          name: "deleted",
        });
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
    const previous = JSON.parse(JSON.stringify(existingItem || 0));

    if (typeof attribute === "string") {
      existingItem[attribute] = existingItem[attribute] + value;
    } else {
      existingItem = (existingItem || 0) + attribute;
    }

    const saveType = previous ? "updated" : "created";

    emitToSubscribers(saveType, key, {
      name: saveType,
      item: existingItem,
      previous,
    });

    return (await this.set(key, existingItem)) as T;
  },
  on: function (
    name: ListenerPath | ListenerPath[],
    ...handler: [{ timeout: number }, DataEventHandler] | [DataEventHandler]
  ): void {
    const paths = Array.isArray(name) ? name : [name];
    paths.forEach((path) => {
      if (!store.subscriptions[path]) {
        store.subscriptions[path] = [];
      }

      store.subscriptions[path].push(handler[handler.length - 1]);
    });
  },
  set: async function <T>(
    keys: any[] | string,
    value?: any | setBatchOptions | boolean,
    opts?: undefined | setOptions
  ): Promise<SetBatchResponse<T> | SetResponse<T> | T> {
    // Single Set
    if (typeof keys === "string") {
      const previous = store.root[keys]
        ? JSON.parse(JSON.stringify(store.root[keys]))
        : undefined;
      store.root[keys] = value;

      labelKeys.forEach((labelKey) => {
        if (typeof opts?.[labelKey] === "string") {
          store[labelKey][opts[labelKey]] = value;
          store.labels[keys] = store.labels[keys] || {};
          store.labels[keys][labelKey] = opts[labelKey];
        }
      });

      emitToSubscribers(!!previous ? "updated" : "created", keys, {
        name: !!previous ? "updated" : "created",
        item: value,
        previous: previous,
      });

      return value as SetResponse<T>;

      // Batch Set
    } else {
      return {
        items: await Promise.all(keys.map((key) => data.set(key, value, opts))),
      };
    }
  },
};
