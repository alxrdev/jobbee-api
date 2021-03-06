import { UpdateUserUseCase } from '@modules/users/useCases'
import { AppError } from '@errors/index'
import { UpdateUserDTO } from '@modules/users/dtos'
import { User } from '@modules/users/entities'
import { UserNotFoundError } from '@modules/users/errors'
import IUserRepository from '@modules/users/repositories/IUserRepository'
import FakeUserRepository from '@modules/users/repositories/fake/FakeUserRepository'

const makeUser = (fields = {}) : UpdateUserDTO => {
  const data = { id: '1', authUserId: '1', name: 'UserUpdated', headline: 'My headline', address: 'my address', bio: 'my bio', ...fields }
  return Object.assign(new UpdateUserDTO(), data)
}

let userRepository: IUserRepository

const makeSut = () : UpdateUserUseCase => new UpdateUserUseCase(userRepository)

describe('Test the UpdateUserUseCase class', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  beforeAll(async () => {
    userRepository = new FakeUserRepository()
    await userRepository.create(User.builder()
      .withId('1')
      .withName('user')
      .withEmail('user@email.com')
      .withAvatar('user.jpg')
      .withPassword('password')
      .build()
    )
  })

  it('Should update and return the user', async () => {
    const updateUserUseCase = makeSut()
    const spyFindById = jest.spyOn(userRepository, 'findById')
    const spyUpdate = jest.spyOn(userRepository, 'update')
    const user = makeUser()

    const result = await updateUserUseCase.execute(user)

    expect(result).toBeInstanceOf(User)
    expect(result.name).toEqual('UserUpdated')
    expect(spyFindById).toHaveBeenCalled()
    expect(spyUpdate).toHaveBeenCalled()
  })

  it('Should throw an AppError when the user to update is not the authenticated user', async () => {
    const updateUserUseCase = makeSut()
    const user = makeUser({ authUserId: '2' })

    await expect(updateUserUseCase.execute(user))
      .rejects
      .toThrowError(AppError)
  })

  it('Should throw an AppError when the user do not exists', async () => {
    const updateUserUseCase = makeSut()
    const spyFindById = jest.spyOn(userRepository, 'findById')
    const user = makeUser({ id: '2', authUserId: '2' })

    await expect(updateUserUseCase.execute(user))
      .rejects
      .toThrowError(UserNotFoundError)
    expect(spyFindById).toHaveBeenCalled()
  })
})
