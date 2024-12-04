import { FastifyReply, FastifyRequest } from 'fastify'

export type DefaultService<T> = (
  request: FastifyRequest,
  reply: FastifyReply,
) => Promise<ApiResponse<T>>
