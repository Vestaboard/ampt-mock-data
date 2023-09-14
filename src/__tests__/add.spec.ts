import { data, reset } from "../data";

interface ITest {
  number: number;
}

describe("Add", () => {
  beforeEach(() => reset());

  it("Should add a value to a key", async () => {
    await data.set("test:1", 1);

    const result = await data.add("test:1", 1);

    expect(result).toBe(2);
  });

  it("Should subtract a value from a key", async () => {
    await data.set("test:1", 3);

    const result = await data.add("test:1", -1);

    expect(result).toBe(2);
  });

  it("Should add a value to a nested key", async () => {
    await data.set<ITest>("test:1", {
      number: 1,
    });

    const result = (await data.add<ITest>("test:1", "number", 1)) as ITest;

    expect(result?.number).toBe(2);
  });

  it("Should subtract a value to a nested key", async () => {
    await data.set<ITest>("test:1", {
      number: 5,
    });

    const result = (await data.add<ITest>("test:1", "number", -2)) as ITest;

    expect(result?.number).toBe(3);
  });
});
