import Job from '../entities/Job'
import ListJobsFiltersDTO from '../dtos/ListJobsFiltersDTO'
import CollectionResponse from '../entities/CollectionResponse'
import FindJobsByGeolocationFiltersDTO from '../dtos/FindJobsByGeolocationFiltersDTO'

export default interface IJobRepository {
  fetchById (id: string): Promise<Job>
  fetchAll (options: ListJobsFiltersDTO): Promise<CollectionResponse<Job>>
  fetchByGeolocation (latitude: number, logitude: number, distance: number, filters: FindJobsByGeolocationFiltersDTO): Promise<CollectionResponse<Job>>
  create (job: Job): Promise<Job>
  update (job: Job): Promise<Job>
  delete (id: string): Promise<void>
}
