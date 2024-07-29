import { lucia } from '@lib/auth/lucia'
import { verify } from '@node-rs/argon2'
import { db, table_users } from '@lib/auth/db'
import { isValidData } from '@lib/auth/validation'
import { eq } from 'drizzle-orm'
import type { APIContext } from 'astro'

export async function POST(context: APIContext): Promise<Response> {
  const formData = await context.request.formData()
  const email = formData.get('email')?.toString() || ''
  const password = formData.get('password')?.toString() || ''

  if (!isValidData(email, password)) {
    console.log('INVALID DATA')
    return new Response('Invalid data', {
      status: 400,
    })
  }

  const existingUser = (
    await db
      .selectDistinct()
      .from(table_users)
      .where(eq(table_users.email, email))
  )[0]

  if (!existingUser) {
    return new Response('Incorrect username or password', {
      status: 400,
    })
  }

  const validPassword = await verify(existingUser.password_hash!, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  })

  if (!validPassword) {
    return new Response('Incorrect username or password', {
      status: 400,
    })
  }

  const session = await lucia.createSession(existingUser.id!, {})
  const sessionCookie = lucia.createSessionCookie(session.id)

  context.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  )

  return context.redirect('/admin')
}