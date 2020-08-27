import { injectable, inject } from 'tsyringe'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'

import IUserRepository from '../repositories/IUserRepository'
import IAuthService from '../../../services/auth/interfaces/IAuthService'
import { User } from '../entities'
import { AuthDTO } from '../dtos'
import validateClassParameters from '../../../utils/validateClassParameters'
import { AuthenticationError } from '../errors'

dotenv.config()

export interface IAuthUserResponse {
  user: User
  token: string
}

@injectable()
export default class AuthenticateUserUseCase {
  constructor (
    @inject('UserRepository')
    private readonly userRepository: IUserRepository,

    @inject('AuthService')
    private readonly authService: IAuthService
  ) {}

  public async execute (userDto: AuthDTO): Promise<IAuthUserResponse> {
    await validateClassParameters(userDto)

    let user: User

    try {
      user = await this.userRepository.findByEmail(userDto.email)
    } catch (error) {
      throw new AuthenticationError('Incorrect email/password combination.', false, 401)
    }

    const passwordMatched = bcrypt.compareSync(userDto.password, user.password)

    if (!passwordMatched) {
      throw new AuthenticationError('Incorrect email/password combination.', false, 401)
    }

    const token = this.authService.authenticateUser(user)

    return {
      user,
      token
    }
  }
}
