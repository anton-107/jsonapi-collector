import { createServer } from "node:http";

// Create a mock server
export const correctServer = createServer((req, res) => {
  // Define the mocked response
  const responseData = JSON.stringify({
    field1: "value1",
  });

  // Send the mocked response
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end(responseData);
});
// Create a mock server that responds with an error
export const faultyServer = createServer((req, res) => {
  // Send the mocked response
  res.statusCode = 500;
  res.setHeader("Content-Type", "text/plain");
  res.end();
});
