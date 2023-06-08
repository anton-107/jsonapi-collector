import assert from "node:assert/strict";
import { after, before, describe, it, mock } from "node:test";

import { request } from "http";

import { JSONAPIReader } from "../src/json-api-reader";
import { correctServer, faultyServer } from "./mock-servers.test";

describe("JSON API reader", () => {
  before(() => {
    // Start the servers
    correctServer.listen(3000);
    faultyServer.listen(3001);
  });
  after(() => {
    // Stop the servers
    correctServer.close();
    faultyServer.close();
  });
  it("parses json response and returns values of found values", async () => {
    const reader = new JSONAPIReader({
      httpClient: {
        post: mock.fn(request),
      },
    });
    const results = await reader.fetchPost<string[]>(
      { hostname: "localhost", port: 3000 },
      "",
      "$.field1"
    );
    assert.equal(results[0], "value1");
  });
  it("throws an error on non-existent connection", async () => {
    const reader = new JSONAPIReader({
      httpClient: {
        post: mock.fn(request),
      },
    });

    assert.rejects(async () => {
      await reader.fetchPost<string[]>(
        { hostname: "localhost", port: 3002 },
        "",
        ""
      );
    });
  });
  it("throws an error on faulty response", async () => {
    const reader = new JSONAPIReader({
      httpClient: {
        post: mock.fn(request),
      },
    });

    assert.rejects(async () => {
      await reader.fetchPost<string[]>(
        { hostname: "localhost", port: 3001 },
        "",
        ""
      );
    });
  });
});
