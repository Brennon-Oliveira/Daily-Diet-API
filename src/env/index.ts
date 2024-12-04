import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_CONNECTION: z.string(),
  PORT: z
    .number({
      message: 'Erro aaaaaaaa',
    })
    .default(3333),
})

const { success, data, error } = envSchema.safeParse(process.env)

if (!success) {
  const errorMessage = 'Invalid environment variable!'
  console.error(errorMessage, error.format())
  throw new Error(errorMessage)
}

export const env = data
