import { DefaultService } from './default-service'

export interface IUserService {
  create: DefaultService<unknown>
  login: DefaultService<unknown>
}
