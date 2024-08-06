import { events } from "../events";

describe("events", () => {
  beforeEach(events.reset);

  it("Should publish an event", () => {
    const spy = jest.fn();
    events.on("my.event", spy);
    events.publish("my.event", { message: "Hello, World!" });

    expect(spy).toHaveBeenCalledWith({
      body: { message: "Hello, World!" },
      name: "my.event",
    });
  });

  it("Should ignore timeouts and config and just test the event", () => {
    const spy = jest.fn();
    events.on("my.event", { timeout: 10000 }, spy);
    events.publish(
      "my.event",
      {
        timeout: 1000,
      },
      { message: "Hello, World!" }
    );

    expect(spy).toHaveBeenCalledWith({
      body: { message: "Hello, World!" },
      name: "my.event",
    });
  });
});
