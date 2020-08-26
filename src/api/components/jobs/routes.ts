import { Router } from 'express'
import { isAuthenticated, authorizedRole } from '../../../middlewares/auth'
import fileUpload from '../../../middlewares/fileUpload'
import { diskStorage } from '../../../configs/storage'

import {
  listJobsUseCase,
  showJobUseCase,
  createJobUseCase,
  updateJobUseCase,
  deleteJobUseCase,
  findJobsByGeolocation,
  applyToJobUseCase,
  listJobsAppliedUseCase,
  listPublishedJobsByUserUseCase
} from './utils/dependencies'

import JobsController from './controllers/JobsController'
import JobsGeolocationController from './controllers/JobsGeolocationController'
import JobsApplyController from './controllers/JobsApplyController'
import UsersJobsController from './controllers/UsersJobsController'

const routes = Router()

const jobsController = new JobsController(listJobsUseCase, showJobUseCase, createJobUseCase, updateJobUseCase, deleteJobUseCase)

routes.get('/jobs', jobsController.index)
routes.get('/jobs/:id', jobsController.show)
routes.post('/jobs', isAuthenticated, authorizedRole('employeer'), jobsController.create)
routes.put('/jobs/:id', isAuthenticated, authorizedRole('employeer'), jobsController.update)
routes.delete('/jobs/:id', isAuthenticated, authorizedRole('employeer'), jobsController.delete)

const jobsGeolocationController = new JobsGeolocationController(findJobsByGeolocation)

routes.get('/jobs/:zipcode/:distance', jobsGeolocationController.index)

const jobsApplyController = new JobsApplyController(listJobsAppliedUseCase, applyToJobUseCase)

routes.get('/users/:id/applied', isAuthenticated, authorizedRole('user'), jobsApplyController.index)
routes.post('/jobs/:id/apply', isAuthenticated, authorizedRole('user'), fileUpload(diskStorage).single('resume'), jobsApplyController.create)

const usersJobsController = new UsersJobsController(listPublishedJobsByUserUseCase)

routes.get('/users/:id/jobs', usersJobsController.index)

export default routes
