import fastify from 'fastify'
import { env } from './env'
import { userPlugin } from './plugins/user.plugin'
import fastifyCookie from '@fastify/cookie'

const app = fastify()

app.register(fastifyCookie)
app.register(userPlugin, {
  prefix: 'users',
})

app.listen({ port: env.PORT }, (err, address) => {
  if (err) {
    throw Error(err.message)
  }

  console.log(`Server is running ${address}`)
})
