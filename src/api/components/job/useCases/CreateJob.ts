import IJobRepository from '../repositories/IJobRepository'
import CreateJobDTO from '../dtos/CreateJobDTO'
import Job from '../entities/Job'
import { v4 as uuidv4 } from 'uuid'
import slugify from 'slugify'

export default class CreateJob {
  private jobsRepository: IJobRepository

  constructor (jobsRepository: IJobRepository) {
    this.jobsRepository = jobsRepository
  }

  public async create (jobDto: CreateJobDTO): Promise<Job> {
    const lastDate = new Date()
    lastDate.setDate(lastDate.getDate() + 7)

    const job = new Job(
      uuidv4(),
      jobDto.title,
      slugify(jobDto.title, { lower: true }),
      jobDto.description,
      jobDto.email,
      jobDto.address,
      jobDto.company,
      jobDto.industry,
      jobDto.jobType,
      jobDto.minEducation,
      jobDto.experience,
      jobDto.salary,
      jobDto.position,
      new Date(),
      lastDate
    )

    const result = await this.jobsRepository.store(job)

    return result
  }
}
