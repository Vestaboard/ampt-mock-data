# AMPT Data Mock

Mocks to do unit testing against fake `@ampt/data` in memory.

## Installation

```bash
# NPM
npm i ampt-data-mock --dev

# Yarn
yarn add ampt-data-mock --save-dev
```

## Usage With Jest

At the top of your test, just mock `@ampt/data` with the export from this library.

```js
import { data } from "ampt-data-mock";

jest.mock("@ampt/data", () => ({
  data,
}));

describe("My tests", () => {
  it("Should do a thing", async () => {
    // Bootstrap the data with any keys you need to create beforehand...
    await data.set("key", { value: "foo" });

    // Your tests...
  });
});
```

## Notes

This is still a work in progress. The goal is to support all of the Ampt data API in memory, but we are starting with the simple use-cases.

This is an independently maintained repo and is not owned or operated by [Ampt](https://getampt.com/) in any way.
