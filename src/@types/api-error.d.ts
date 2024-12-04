declare type ApiError =
  | import('zod').ZodIssue
  | (string & {
      __brand: 'error'
    })
