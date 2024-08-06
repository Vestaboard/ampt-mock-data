import { data, reset } from "../data";

import { handledEvent } from "../helpers";

describe("data events", () => {
  afterEach(reset);

  it("Should listen to all events", () => {
    const spy = jest.fn();
    data.on("*", spy);
    data.set("FOO:1", { id: "1" });
    expect(spy).toHaveBeenCalledWith(handledEvent("created", { id: "1" }));
  });

  it("Should listen to created events", () => {
    const spy = jest.fn();
    data.on("created", spy);
    data.set("FOO:1", { id: "1" });
    expect(spy).toHaveBeenCalledWith(handledEvent("created", { id: "1" }));
  });

  it("Should not emit created events to update listeners", () => {
    const spy = jest.fn();
    data.on("updated", spy);
    data.set("FOO:1", { id: "1" });
    expect(spy).not.toHaveBeenCalled();
  });

  it("Should listen to updated events", () => {
    const spy = jest.fn();
    data.on("updated", spy);
    data.set("FOO:1", { id: "1" });
    data.set("FOO:1", { id: "2" });

    expect(spy).toHaveBeenCalledWith(
      handledEvent("updated", { id: "2" }, { id: "1" })
    );
  });

  it("Should listen to deleted events", () => {
    const spy = jest.fn();
    data.on("deleted", spy);
    data.set("FOO:1", { id: "1" });
    data.remove("FOO:1");

    expect(spy).toHaveBeenLastCalledWith(
      handledEvent("deleted", null, { id: "1" })
    );
  });

  it("Should listen for specific paths", () => {
    const spy = jest.fn();
    data.on("created:FOO:*", spy);
    data.set("FOO:1", { id: "1" });

    expect(spy).toHaveBeenCalledWith({
      name: "created",
      item: { value: { id: "1" } },
      previous: {},
    });
  });

  it("Should listen for more complex specific paths", () => {
    const spy = jest.fn();
    data.on("*:FOO:BAR:1", spy);
    data.set("FOO:BAR:1", { id: "1" });

    expect(spy).toHaveBeenCalledWith(handledEvent("created", { id: "1" }));
  });
});
