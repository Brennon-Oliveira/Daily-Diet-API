import { User } from '../../models/user'

export interface IUserRepository {
  create: (user: User) => Promise<void>
  getById: (id: string) => Promise<User>
  getByUsername: (username: string) => Promise<User>
  update: (user: User) => Promise<void>
}
