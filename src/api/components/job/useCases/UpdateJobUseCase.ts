import IJobRepository from '../repositories/IJobRepository'
import Job from '../entities/Job'
import Industry from '../entities/Industry'
import JobType from '../entities/JobTypes'
import Education from '../entities/Education'
import Experience from '../entities/Experience'
import UpdateJobDTO from '../dtos/UpdateJobDTO'
import slugify from 'slugify'
import validateClassParameters from '../../../../utils/validateClassParameters'

export default class UpdateJobUseCase {
  constructor (
    private readonly jobRepository: IJobRepository
  ) {}

  public async update (jobDto: UpdateJobDTO): Promise<Job> {
    await validateClassParameters(jobDto)

    const industry = new Industry(jobDto.industry.split(','))
    const jobType = new JobType(jobDto.jobType)
    const minEducation = new Education(jobDto.minEducation)
    const experience = new Experience(jobDto.experience)

    const jobToUpdate = await this.jobRepository.fetchById(jobDto.id)

    const jobUpdated = new Job(
      jobToUpdate.getId(),
      jobDto.title,
      slugify(jobDto.title ?? '', { lower: true }),
      jobDto.description,
      jobDto.email,
      jobDto.address,
      jobDto.company,
      industry,
      jobType,
      minEducation,
      experience,
      jobDto.salary,
      jobDto.position,
      jobToUpdate.getPostingDate(),
      jobToUpdate.getLastDate()
    )

    return await this.jobRepository.update(jobUpdated)
  }
}
