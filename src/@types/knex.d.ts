// eslint-disable-next-line
import { knex } from 'knex'
import { User } from '../models/user'

declare module 'knex/types/tables' {
  export interface Tables {
    users: User
  }
}
