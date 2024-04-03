import {neon, neonConfig} from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

neonConfig.fetchConnectionCache = true
// doesn't create new connections  everytime we reload the page

if (!process.env.DATABASE_URL) {
  throw new Error("database url is not defined")
}

const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql);