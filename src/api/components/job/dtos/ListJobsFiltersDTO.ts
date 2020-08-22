export default interface ListJobsFiltersDTO {
  title?: string
  description?: string
  company?: string
  industry?: Array<string>
  jobType?: string
  minEducation?: string
  industryRegex?: Array<RegExp>
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: string
}
