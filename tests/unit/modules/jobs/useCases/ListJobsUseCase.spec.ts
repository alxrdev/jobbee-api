import { ListJobsFiltersDTO } from '@modules/jobs/dtos'
import { Job } from '@modules/jobs/entities'
import FakeJobRepository from '@modules/jobs/repositories/fake/FakeJobRepository'
import IJobRepository from '@modules/jobs/repositories/IJobRepository'
import { ListJobsUseCase } from '@modules/jobs/useCases'
import { User } from '@modules/users/entities'
import FakeUserRepository from '@modules/users/repositories/fake/FakeUserRepository'
import IUserRepository from '@modules/users/repositories/IUserRepository'

const makeDto = (fields = {}) : ListJobsFiltersDTO => {
  const data = { what: 'Developer', where: 'São Mateus', jobType: 'Full-time', page: 1, limit: 5, sortBy: 'createdAt', sortOrder: 'asc', ...fields }
  return Object.assign(new ListJobsFiltersDTO(), data)
}

const makeJob = async (id: string, user: User) : Promise<Job> => Job.builder()
  .withId(id)
  .withTitle('Developer')
  .withUser(user)
  .build()

let userRepository: IUserRepository
let jobRepository: IJobRepository

const makeSut = () : ListJobsUseCase => new ListJobsUseCase(jobRepository)

describe('Test the ListJobsUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  beforeAll(async () => {
    userRepository = new FakeUserRepository()
    const user = await userRepository.create(User.builder()
      .withId('1')
      .withName('John Doe')
      .withEmail('user@email.com')
      .withRole('employer')
      .withAvatar('avatar.jpg')
      .withPassword('password')
      .withHeadline('my headline')
      .build()
    )

    jobRepository = new FakeJobRepository(userRepository)
    await jobRepository.create(await makeJob('1', user))
    await jobRepository.create(await makeJob('2', user))
    await jobRepository.create(await makeJob('3', user))
    await jobRepository.create(await makeJob('4', user))
    await jobRepository.create(await makeJob('5', user))
  })

  it('Should return all jobs', async () => {
    const listJobsUseCase = makeSut()
    const dto = makeDto()

    const jobs = await listJobsUseCase.execute(dto)

    expect(jobs.collection.length).toBe(5)
  })

  it('Should return only 2 jobs', async () => {
    const listJobsUseCase = makeSut()
    const dto = makeDto({ limit: 2 })

    const jobs = await listJobsUseCase.execute(dto)

    expect(jobs.collection.length).toBe(2)
  })

  it('Should return the next page link', async () => {
    const listJobsUseCase = makeSut()
    const dto = makeDto({ limit: 2 })

    const jobs = await listJobsUseCase.execute(dto)

    expect(jobs.collection.length).toBe(2)
    expect(jobs.next).not.toBeUndefined()
    expect(jobs.next).not.toBe('')
  })

  it('Should return the previous page link', async () => {
    const listJobsUseCase = makeSut()
    const dto = makeDto({ limit: 2, page: 3 })

    const jobs = await listJobsUseCase.execute(dto)

    expect(jobs.collection.length).toBe(1)
    expect(jobs.previous).not.toBeUndefined()
    expect(jobs.previous).not.toBe('')
  })

  it('Should return the previous and next page link', async () => {
    const listJobsUseCase = makeSut()
    const dto = makeDto({ limit: 2, page: 2 })

    const jobs = await listJobsUseCase.execute(dto)

    expect(jobs.collection.length).toBe(2)
    expect(jobs.previous).not.toBeUndefined()
    expect(jobs.previous).not.toBe('')
    expect(jobs.next).not.toBeUndefined()
    expect(jobs.next).not.toBe('')
  })

  it('Should not return any job', async () => {
    const listJobsUseCase = makeSut()
    const dto = makeDto({ limit: 2, page: 1, what: 'programmer' })

    const jobs = await listJobsUseCase.execute(dto)

    expect(jobs.collection.length).toBe(0)
    expect(jobs.previous).toBe('')
    expect(jobs.next).toBe('')
  })

  it('Should return jobs in ascending order', async () => {
    const listJobsUseCase = makeSut()
    const dto = makeDto({ limit: 2, page: 1 })

    const jobs = await listJobsUseCase.execute(dto)

    expect(jobs.collection.length).toBe(2)
    expect(jobs.collection[0].id).toBe('1')
    expect(jobs.collection[1].id).toBe('2')
  })

  it('Should return jobs in descending order', async () => {
    const listJobsUseCase = makeSut()
    const dto = makeDto({ limit: 2, page: 1, sortOrder: 'desc' })

    const jobs = await listJobsUseCase.execute(dto)

    expect(jobs.collection.length).toBe(2)
    expect(jobs.collection[0].id).toBe('5')
    expect(jobs.collection[1].id).toBe('4')
  })
})
