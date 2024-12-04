import { Knex, knex as setupKnex } from 'knex'
import { env } from './env'

export const dbConfig: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: env.DATABASE_CONNECTION,
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const knex = setupKnex(dbConfig)
