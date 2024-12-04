export interface User {
  id: string
  username: string
  password_hash: string
  salts: string
  session_id?: string
}
