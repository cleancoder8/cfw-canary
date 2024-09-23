import { Hono } from "hono";
import { swaggerUI } from "@hono/swagger-ui";
import openapi from "./openapi.json";
import { logger } from "hono/logger";

const app = new Hono<{ Bindings: CloudflareBindings }>();
app.use(logger());
app.get("/sql", async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM canary_table",
  ).all(); // Run SQL query
  return c.json(results);
});
app.get("/kv/:key", async (c) => {
  const key = c.req.param("key");
  const value = await c.env.CANARY_NAMESPACE.get(key); // Accessing KV
  if (value) {
    return c.text(`The value for key "${key}" is: ${value}`);
  } else {
    return c.text(`No value found for key "${key}"`, 404);
  }
});

// Save a value to KV
app.post("/kv", async (c) => {
  const { key, value } = await c.req.json();
  await c.env.CANARY_NAMESPACE.put(key, value); // Storing the value in KV
  return c.text(`Saved value "${value}" under key "${key}"`);
});

// Delete a key from KV
app.delete("/kv/:key", async (c) => {
  const key = c.req.param("key");
  await c.env.CANARY_NAMESPACE.delete(key); // Deleting the value from KV
  return c.text(`Deleted key "${key}"`);
});

app.get("/hello", (c) => {
  return c.json({ message: "hi Ayush" });
});
app.get("/doc", (c) => {
  return c.json(openapi);
});

app.get("/ui", swaggerUI({ url: "/doc" }));
export default app;
