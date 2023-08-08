import { data } from "../data";

interface ITest {
  hello: string;
}

describe("Data", () => {
  it("should set data", async () => {
    const setResult = (await data.set<ITest>("test:1", {
      hello: "world",
    })) as ITest;

    expect(setResult?.hello).toBe("world");

    const getResult = (await data.get<ITest>("test:1")) as ITest;

    expect(getResult?.hello).toBe("world");
  });

  it("Should get a batch of data", async () => {
    await data.set("test:1", { hello: "world" });
    await data.set("test:2", { hello: "again" });

    const getResult = await data.get<ITest>(["test:1", "test:2"]);

    expect(getResult.items.length).toBe(2);
    expect(getResult.items[0].value.hello).toBe("world");
    expect(getResult.items[1].value.hello).toBe("again");
  });

  it("Should query data", async () => {
    await data.set("test:1", { hello: "world" });
    await data.set("test:2", { hello: "again" });

    const getResult = await data.get<ITest>("test:*");

    expect(getResult.items.length).toBe(2);
    expect(getResult.items[0].value.hello).toBe("world");
    expect(getResult.items[1].value.hello).toBe("again");
  });

  it("Should reverse results data", async () => {
    await data.set("test:1", { hello: "world" });
    await data.set("test:2", { hello: "again" });

    const getResult = await data.get<ITest>("test:*", {
      reverse: true,
    });

    expect(getResult.items.length).toBe(2);
    expect(getResult.items[1].value.hello).toBe("world");
    expect(getResult.items[0].value.hello).toBe("again");
  });

  it("Should limit the results", async () => {
    await data.set("test:1", { hello: "world" });

    await data.set("test:2", { hello: "universe" });

    const result = await data.get<ITest>("test:*", {
      limit: 1,
    });

    expect(result.items.length).toBe(1);
    expect(result.items[0].value.hello).toBe("world");
  });

  it("Should accept a starting cursor limit the results", async () => {
    await data.set("test:1", { hello: "world" });

    await data.set("test:2", { hello: "universe" });

    const result = await data.get<ITest>("test:*", {
      limit: 1,
      start: "test:1",
    });

    expect(result.items.length).toBe(1);
    expect(result.items[0].value.hello).toBe("universe");
  });
});
