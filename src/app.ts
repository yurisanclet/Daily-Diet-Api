import { fastify } from 'fastify'
import { meals } from './routes/meals'
import cookie from '@fastify/cookie'
import { user } from './routes/user'

export const app = fastify()

app.register(cookie)
app.register(user, {
  prefix: 'user'
})
app.register(meals, {
  prefix: 'meals'
})
