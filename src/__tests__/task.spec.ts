import { task } from "../task";

describe("Task", () => {
  it("Should create and run a task", async () => {
    const myTask = task("myTask", async (event, context) => {
      return event.body;
    });

    const result = await myTask.run({ message: "Hello, World!" });

    expect(result).toEqual({ message: "Hello, World!" });
  });
});
