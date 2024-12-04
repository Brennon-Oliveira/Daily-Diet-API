// user.service.ts
import { z } from 'zod'
import { IUserRepository } from '../interfaces/repositories/user.repository.interface'
import { IUserService } from '../interfaces/services/user.service.interface'
import { createUserRepository } from '../repositories/user.repositories'
import { FastifyReply, FastifyRequest } from 'fastify'
import { createUserBuilder, UserBuilder } from '../factories/user.factory'
import { randomUUID } from 'crypto'

export const createUserService = async (configuration: {
  userRepository?: IUserRepository
  userBuilder?: UserBuilder
}): Promise<IUserService> => {
  const userRepository =
    configuration.userRepository || createUserRepository({})
  const userBuilder =
    configuration.userBuilder || (await createUserBuilder({ userRepository }))

  const validateUserData = (object: unknown) => {
    const validateUserSchema = z.object({
      username: z.string({
        required_error: 'Username is required',
        invalid_type_error: 'Username is invalid',
      }),
      password: z.string({
        required_error: 'Password is required',
        invalid_type_error: 'Password is invalid',
      }),
    })

    const result = validateUserSchema.safeParse(object)

    if (!result.success) {
      return {
        data: null,
        errors: result.error.issues,
      }
    }
    return {
      data: result.data,
      errors: [],
    }
  }

  return {
    create: async (
      request: FastifyRequest,
      reply: FastifyReply,
    ): Promise<ApiResponse<unknown>> => {
      const { data, errors } = validateUserData(request.body)

      if (!data) {
        reply.status(400)
        return {
          data: null,
          errors,
        }
      }

      const user = await userBuilder
        .setUsername(data.username)
        .setPassword(data.password)
        .getUser()

      try {
        const createdUser = await userRepository.create(user)
        return {
          data: createdUser,
          errors: [],
        }
      } catch {
        reply.status(500)
        return {
          data: null,
          errors: ['Internal Server Error' as ApiError],
        }
      }
    },
    login: async (
      request: FastifyRequest,
      reply: FastifyReply,
    ): Promise<ApiResponse<unknown>> => {
      const { data, errors } = validateUserData(request.body)

      if (!data) {
        reply.status(400)
        return {
          data: null,
          errors,
        }
      }

      userBuilder.fromUsername(data.username)

      if (!(await userBuilder.checkPassword(data.password))) {
        return {
          data: null,
          errors: ['Username or password is wrong' as ApiError],
        }
      }

      userBuilder.setSession(randomUUID())
      const user = await userBuilder.getUser()
      await userRepository.update(user)

      if (!user.session_id) {
        reply.status(500)
        return {
          data: null,
          errors: ['Internal Server Error' as ApiError],
        }
      }

      reply.cookie('sessionId', user.session_id, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })

      reply.status(204).send()
      return {
        data: null,
        errors: [],
      }
    },
  }
}
