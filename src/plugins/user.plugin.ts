import { FastifyInstance } from 'fastify'
import { z } from 'zod'

export const userPlugin = (app: FastifyInstance) => {
  app.post('/register', (request, reply) => {})
}
