import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { JSONAPIReader } from "../src/json-api-reader";

describe("JSON API reader", () => {
  it("instntiates", () => {
    const reader = new JSONAPIReader();
    assert.equal(reader.version(), 1);
  });
});
