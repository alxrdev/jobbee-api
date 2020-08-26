import Job from '../entities/Job'
import ListJobsFiltersDTO from '../dtos/ListJobsFiltersDTO'
import CollectionResponse from '../entities/CollectionResponse'
import FindJobsByGeolocationFiltersDTO from '../dtos/FindJobsByGeolocationFiltersDTO'
import FilesToDeleteCollection from '../entities/FilesToDeleteCollection'

export default interface IJobRepository {
  findById (id: string): Promise<Job>
  findAll (options: ListJobsFiltersDTO): Promise<CollectionResponse<Job>>
  findByGeolocation (latitude: number, logitude: number, distance: number, filters: FindJobsByGeolocationFiltersDTO): Promise<CollectionResponse<Job>>
  create (job: Job): Promise<Job>
  update (job: Job): Promise<Job>
  delete (id: string): Promise<FilesToDeleteCollection>
  findAppliedJobs (userId: string): Promise<Array<Job>>
  applyToJob(jobId: string, userId: string, resume: string): Promise<void>
  removeApplyToJobs (userId: string): Promise<FilesToDeleteCollection>
}
