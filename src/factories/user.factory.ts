import { randomInt, randomUUID } from 'crypto'
import bcrypt from 'bcrypt'
import { IUserRepository } from '../interfaces/repositories/user.repository.interface'
import { User } from '../models/user'

export interface UserBuilder {
  getId: () => Promise<string>
  setUsername: (username: string) => UserBuilder
  setPassword: (password: string) => UserBuilder
  setSession: (session: string) => UserBuilder
  createSession: () => UserBuilder
  getSession: () => Promise<string | null>
  fromId: (id: string) => UserBuilder
  fromUsername: (username: string) => UserBuilder
  checkPassword: (password: string) => Promise<boolean>
  getUser: () => Promise<User>
}

export const createUserBuilder = async (configuration: {
  userRepository?: IUserRepository
}): Promise<UserBuilder> => {
  const userRepository = configuration.userRepository || ({} as IUserRepository)

  let user: Partial<User> = {
    id: randomUUID(),
  }

  const userIsReady: Promise<void> = Promise.resolve()

  const userBuilder: UserBuilder = {
    async getId() {
      await userIsReady
      return user.id || ''
    },
    setUsername(username: string) {
      userIsReady.then(() => {
        user.username = username
      })
      return this
    },
    setPassword(password: string) {
      userIsReady.then(() => {
        const salts = bcrypt.genSaltSync(randomInt(9) + 1)

        const hash = bcrypt.hashSync(password, salts)

        user.password_hash = hash
        user.salts = salts
      })
      return this
    },
    createSession() {
      userIsReady.then(() => {
        user.session_id = randomUUID()
      })
      return this
    },
    async getSession() {
      await userIsReady
      return user.session_id ?? null
    },
    setSession(session: string) {
      userIsReady.then(() => {
        user.session_id = session
      })
      return this
    },
    fromId(id: string) {
      userIsReady.then(async () => {
        user = await userRepository.getById(id)
      })
      return this
    },
    async getUser() {
      await userIsReady
      return user as User
    },
    async checkPassword(password: string) {
      await userIsReady

      const passwordHash = bcrypt.hashSync(password, user.salts || '')

      return bcrypt.compareSync(passwordHash, user.password_hash || '')
    },
    fromUsername(username: string) {
      userIsReady.then(async () => {
        user = await userRepository.getByUsername(username)
      })
      return this
    },
  }

  return userBuilder
}
