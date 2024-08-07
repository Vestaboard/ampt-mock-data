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

### Events and Tasks

We also include mocks to override Ampt events and tasks. They can be used with a testing library in a similar fashion:

```js
import { task, events } from "ampt-data-mock";

jest.mock("@ampt/sdk", () => ({
  task,
  events,
}));
```

Events are triggered immediately upon publishing so that you can syncronously validate your end to end tests.

Tasks can be tested by exporting them and calling `.run()` inside your tests suite.

```js
// Your code
import { task } from "@ampt/sdk";

const myTask = task("my task", (event) => {
  return true;
});

// Your test
describe("My Task", () => {
  it("Should run my task", async () => {
    const result = await myTask.run();
    expect(result).toEqual(true);
  });
});
```

## Resetting

Since this package persists data in memory, it is best practice to reset the data before each unit test using the `reset()` function

```js
import { data, reset } from "ampt-data-mock";

jest.mock("@ampt/data", () => ({
  data,
}));

describe("My tests", () => {
  beforeEach(() => {
    reset();
  });

  // ...
});
```

## Notes

This is still a work in progress. The goal is to support all of the Ampt data API in memory, but we are starting with the simple use-cases.

This is an independently maintained repo and is not owned or operated by [Ampt](https://getampt.com/) in any way.
