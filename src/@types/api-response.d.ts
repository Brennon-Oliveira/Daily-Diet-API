declare type ApiResponse<T> = {
  data: T
  errors: ApiError[]
}
