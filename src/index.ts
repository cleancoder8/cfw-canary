import { Hono } from 'hono'

const app = new Hono<{ Bindings: CloudflareBindings }>()

app.get('/hello', (c) => {
  return c.text('Hello Ayush!')
})

export default app