import { isValidData } from "@lib/auth/validation";
import type { APIRoute } from "astro";
import { generateIdFromEntropySize } from "lucia";
import { db, table_users } from '@lib/auth/db'
import { hash } from "@node-rs/argon2";
import { lucia } from '@lib/auth/lucia'
import type { APIContext } from 'astro'
export const POST: APIRoute = async (context: APIContext) => {
const data = await context.request.formData()
  const email = data.get('email')?.toString() || ''
  const password = data.get('password')?.toString() || ''

  if (!isValidData(email, password)) {
    return new Response('Invalid data', {
      status: 400,
    })
  }
  const userId = generateIdFromEntropySize(10)
  const passwordHash = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  })
  console.log("Hash",passwordHash)
  await db.insert(table_users).values({
    id: userId,
    email: email.toLowerCase(),
    password_hash: passwordHash,
  })
  const session = await lucia.createSession(userId, {})
  const sessionCookie = lucia.createSessionCookie(session.id)
  context.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  )

  return context.redirect('/admin')
};

