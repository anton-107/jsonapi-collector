import { readFileSync, writeFileSync } from "fs";
import { request } from "https";

import { JSONAPIReader } from "./../src/json-api-reader";

async function fetchURL<T>(inputURL: string, postBody: string): Promise<T> {
  if (!process.env.HEADERS) {
    throw Error("Please specify HEADERS in your env variables");
  }
  if (!process.env.JSONPATH_QUERY) {
    throw Error("Please specify JSONPATH_QUERY in your env variables");
  }

  const reader = new JSONAPIReader({
    httpClient: { post: request },
  });
  const url = new URL(inputURL);
  const headers = JSON.parse(process.env.HEADERS);

  console.log("Fetching URL:", url);
  console.log("with headers:", headers);
  console.log("with post body:", postBody);

  const results = await reader.fetchPost<T>(
    {
      protocol: "https:",
      hostname: url.hostname,
      path: `${url.pathname}`,
      headers,
    },
    postBody,
    process.env.JSONPATH_QUERY
  );
  return results;
}

async function main() {
  if (!process.env.METHOD) {
    throw Error("Please specify METHOD in your env variables");
  }
  if (!process.env.REMOTE_URL) {
    throw Error("Please specify REMOTE_URL in your env variables");
  }
  if (!process.env.POST_BODY && !process.env.POST_BODY_FILE) {
    throw Error(
      "Please specify POST_BODY or POST_BODY_FILE in your env variables"
    );
  }

  const url: string = process.env.REMOTE_URL;
  let postBodies: string[] = [];

  if (process.env.POST_BODY) {
    postBodies = [process.env.POST_BODY];
  }
  if (process.env.POST_BODY_FILE) {
    const fileContents = readFileSync(process.env.POST_BODY_FILE).toString(
      "utf8"
    );
    const fileStrings: string[] = fileContents.split("\n");
    postBodies = postBodies.concat(...fileStrings);
  }

  const results = await Promise.all(
    postBodies.map(async (postBody) => await fetchURL(url, postBody))
  );

  console.log("Got results:", results.length);

  const names = results.flat().map((r) => r.name);
  console.log("names", names);
  const uniqueNames: Set<string> = new Set(names);
  console.log("uniqueNames", uniqueNames);
  const namesList = [...uniqueNames.values()];

  const html = namesList
    .sort((a, b) => a.localeCompare(b))
    .map((name) => {
      return `<tr><td>${name}</td></tr>`;
    })
    .join("\n");
  writeFileSync("results.html", `<table>${html}</table>`);
  console.log(`Open results.html to see ${namesList.length} results`);
}

main();
