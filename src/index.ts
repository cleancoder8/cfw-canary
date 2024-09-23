import {Hono} from 'hono'
import {swaggerUI} from '@hono/swagger-ui'
import openapi from "./openapi.json"
import {logger} from 'hono/logger'

const app = new Hono<{ Bindings: CloudflareBindings }>()
app.use(logger())

app.get('/hello', (c) => {
    return c.json(
        {message: "hi Ayush"}
    )
})
app.get('/doc', (c) => {
    return c.json(
        openapi)
})

app.get('/ui', swaggerUI({url: '/doc'}))
export default app