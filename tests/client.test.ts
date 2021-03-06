import { expect } from "chai";
import { Client, Components } from "../src";
import type { ResultArray } from "../src/util/ResultArray";
import type { ResultObject } from "../src/util/ResultObject";

type AsyncReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any;

const client = new Client(process.env.HYPIXEL_KEY || "");

const CheckMeta = (
  data: () =>
    | ResultArray<Components.Schemas.ApiSuccess & { n: unknown }, "n">
    | ResultObject<Components.Schemas.ApiSuccess & { n: unknown }, "n">
) => {
  let result: ReturnType<typeof data>;
  beforeEach(function () {
    result = data();
  });
  it("meta should exist", function () {
    expect(result.meta).to.be.an("object");
  });
  it("success should be true", function () {
    expect(result.meta.success).to.equal(true);
  });
  it("ratelimit data should exist", function () {
    expect(result.meta.ratelimit).to.be.an("object");
    expect(result.meta.ratelimit.limit).to.be.a("number");
    expect(result.meta.ratelimit.reset).to.be.a("number");
    expect(result.meta.ratelimit.remaining).to.be.a("number");
  });
};

describe("Run basic undocumented call", function () {
  this.timeout(30000);
  this.slow(1000);
  let result: { success: boolean; guild?: string };
  it("expect success", async function () {
    result = await client.call("findGuild", { byName: "Mini Squid" });
    expect(result.success).to.equal(true);
  });
  it("expect resulting guild id", function () {
    expect(result.guild).to.equal("553490650cf26f12ae5bac8f");
  });
});

describe("Check SkyBlock news", function () {
  this.timeout(30000);
  this.slow(1000);
  let result: AsyncReturnType<typeof client.skyblock.news>;
  it("expect success", async function () {
    result = await client.skyblock.news();
  });
  CheckMeta(() => result);
  it("required keys should exist", function () {
    for (const news of result) {
      expect(news.title).to.be.a("string").and.not.be.empty;
      expect(news.link).to.be.a("string").and.not.be.empty;
      expect(news.text).to.be.a("string").and.not.be.empty;
      expect(news.item).to.be.an("object").and.not.be.empty;
      expect(news.item.material).to.be.a("string").and.not.be.empty;
      expect(news.item.data).to.satisfy(function (v: unknown) {
        return typeof v === "undefined" || typeof v === "number";
      });
    }
  });
});

describe("Query SkyBlock collections resource", function () {
  this.timeout(30000);
  this.slow(1000);
  let result: AsyncReturnType<typeof client.resources.skyblock.collections>;
  it("expect not to throw", async function () {
    result = await client.resources.skyblock.collections();
  });
  CheckMeta(() => result);
  it("required keys should exist", function () {
    for (const key of Object.keys(result)) {
      const collection = result[key];
      expect(collection.name).to.be.a("string").and.not.be.empty;
      expect(collection.items).to.be.an("object");
      expect(Object.keys(collection.items)).not.be.empty;
      for (const itemName of Object.keys(collection.items)) {
        const item = collection.items[itemName];
        expect(item.name).to.be.a("string").and.not.be.empty;
        expect(item.maxTiers).to.be.a("number");
        expect(item.tiers).to.be.an("array").and.not.be.empty;
      }
    }
  });
});

describe("Query SkyBlock skills resource", function () {
  this.timeout(30000);
  this.slow(1000);
  let result: AsyncReturnType<typeof client.resources.skyblock.skills>;
  it("expect not to throw", async function () {
    result = await client.resources.skyblock.skills();
  });
  CheckMeta(() => result);
  it("required keys should exist", function () {
    for (const key of Object.keys(result)) {
      const skill = result[key];
      expect(skill.name).to.be.a("string").and.not.be.empty;
      expect(skill.description).to.be.a("string").and.not.be.empty;
      expect(skill.maxLevel).to.be.a("number");
      expect(skill.levels).to.be.an("array").and.not.be.empty;
      for (const level of skill.levels) {
        expect(level.level).to.be.a("number");
        expect(level.totalExpRequired).to.be.a("number");
        expect(level.unlocks).to.be.an("array");
      }
    }
  });
});

describe("Get player status", function () {
  this.timeout(30000);
  this.slow(1000);
  let result: AsyncReturnType<typeof client.status.uuid>;
  it("expect not to throw", async function () {
    result = await client.status.uuid("20934ef9488c465180a78f861586b4cf");
  });
  CheckMeta(() => result);
  it("required keys should exist", function () {
    expect(result.online).to.be.an("boolean");
  });
});

describe("Get watchdog stats", function () {
  this.timeout(30000);
  this.slow(1000);
  let result: AsyncReturnType<typeof client.watchdogstats>;
  it("expect not to throw", async function () {
    result = await client.watchdogstats();
  });
  CheckMeta(() => result);
  it("required keys should exist", function () {
    expect(result.watchdog_lastMinute).to.be.greaterThan(-1);
    expect(result.staff_rollingDaily).to.be.greaterThan(-1);
    expect(result.watchdog_total).to.be.greaterThan(-1);
    expect(result.watchdog_rollingDaily).to.be.greaterThan(-1);
    expect(result.staff_total).to.be.greaterThan(-1);
  });
});

// describe("Query SkyBlock profiles by mc uuid", function () {
//   this.timeout(30000);
//   this.slow(1000);
//   let result: AsyncReturnType<typeof client.profiles>;
//   it("expect success", async function () {
//     result = await client.profiles("ec1811e6822b4843bcd4fef82f75deb7");
//     expect(result.length).not.to.equal(0);
//   });
// });

// describe("Query SkyBlock profile by mc uuid", function () {
//   this.timeout(30000);
//   this.slow(1000);
//   let profileId = "74c72b90bdd84b668ccb5a20752030cc";
//   let result: AsyncReturnType<typeof client.profile>;
//   it("expect not to throw", async function () {
//     result = await client.profile(profileId);
//   });
//   it("expect profile to have members", function () {
//     expect(result?.members?.length).not.to.equal(0);
//   });
//   it("expect profile id to equal provided id", function () {
//     expect(result?.profile_id).to.equal(profileId);
//   });
// });
