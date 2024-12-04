import { Knex } from 'knex'
import { IUserRepository } from '../interfaces/repositories/user.repository.interface'
import { knex } from '../database'
import { User } from '../models/user'

export const createUserRepository = (configuration: {
  database?: Knex
}): IUserRepository => {
  const db = configuration.database || knex

  return {
    async create(user: User) {
      await db.table('users').insert(user)
    },
    async getById(id: string) {
      return await db.table('users').where('id', '=', id).first()
    },
    async getByUsername(username: string) {
      return await db.table('users').where('username', '=', username).first()
    },
  }
}
