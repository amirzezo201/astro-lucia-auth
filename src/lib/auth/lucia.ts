import { Lucia } from 'lucia'
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle'
import { db, table_users, table_sessions } from '@lib/auth/db'

const adapter = new DrizzleSQLiteAdapter(db, table_sessions, table_users)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: import.meta.env.PROD,
    },
  },
})
