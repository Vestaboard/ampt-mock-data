import { data } from "../data";

interface ITest {
  hello: string;
}

describe("Labels", () => {
  it("Should query by label", async () => {
    await data.set(
      "test:1",
      { hello: "world" },
      {
        label1: "label1:1",
      }
    );

    const result = await data.getByLabel<ITest>("label1", "label1:*");

    expect(result.items[0].value.hello).toBe("world");
  });

  it("Should get a single label", async () => {
    await data.set(
      "test:1",
      { hello: "world" },
      {
        label1: "label1:1",
      }
    );

    const result = (await data.getByLabel<ITest>(
      "label1",
      "label1:1"
    )) as ITest;

    expect(result.hello).toBe("world");
  });

  it("Should limit the results", async () => {
    await data.set(
      "test:1",
      { hello: "world" },
      {
        label1: "label1:1",
      }
    );

    await data.set(
      "test:2",
      { hello: "universe" },
      {
        label1: "label1:2",
      }
    );

    const result = await data.getByLabel<ITest>("label1", "label1:*", {
      limit: 1,
    });

    expect(result.items.length).toBe(1);
    expect(result.items[0].value.hello).toBe("world");
  });

  it("Should accept a starting cursor limit the results", async () => {
    await data.set(
      "test:1",
      { hello: "world" },
      {
        label1: "label1:1",
      }
    );

    await data.set(
      "test:2",
      { hello: "universe" },
      {
        label1: "label1:2",
      }
    );

    const result = await data.getByLabel<ITest>("label1", "label1:*", {
      limit: 1,
      start: "label1:1",
    });

    expect(result.items.length).toBe(1);
    expect(result.items[0].value.hello).toBe("universe");
  });
});
