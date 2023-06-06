import { writeFileSync } from "fs";
import { request } from "https";

import { JSONAPIReader } from "./../src/json-api-reader";

async function main() {
  if (!process.env.METHOD) {
    throw Error("Please specify METHOD in your env variables");
  }
  if (!process.env.REMOTE_URL) {
    throw Error("Please specify REMOTE_URL in your env variables");
  }
  if (!process.env.HEADERS) {
    throw Error("Please specify HEADERS in your env variables");
  }
  if (!process.env.POST_BODY) {
    throw Error("Please specify POST_BODY in your env variables");
  }
  if (!process.env.JSONPATH_QUERY) {
    throw Error("Please specify JSONPATH_QUERY in your env variables");
  }

  const reader = new JSONAPIReader({
    httpClient: { post: request },
  });

  const url = new URL(process.env.REMOTE_URL);
  const headers = JSON.parse(process.env.HEADERS);

  console.log("Fetching URL:", url);
  console.log("with headers:", headers);
  console.log("with post body:", process.env.POST_BODY);

  const results = await reader.fetchPost(
    {
      protocol: "https:",
      hostname: url.hostname,
      path: `${url.pathname}`,
      headers,
    },
    process.env.POST_BODY,
    process.env.JSONPATH_QUERY
  );

  const html = results
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((r) => {
      return `<tr><td><a href="${r.url}">${r.name}</a></td></tr>`;
    })
    .join("\n");
  writeFileSync("results.html", `<table>${html}</table>`);
  console.log(`Open results.html to see ${results.length} results`);
}

main();
