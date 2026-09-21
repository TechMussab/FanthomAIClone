import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'

const USERS_FILE = join(process.cwd(), 'data', 'users.json')

interface User {
  id: string
  email: string
  password: string
  name: string
  createdAt: string
}

function ensureUsersFile() {
  const dataDir = join(process.cwd(), 'data')
  if (!existsSync(dataDir)) {
    writeFileSync(dataDir + '/.gitkeep', '')
  }
  if (!existsSync(USERS_FILE)) {
    writeFileSync(USERS_FILE, JSON.stringify([]))
  }
}

function readUsers(): User[] {
  ensureUsersFile()
  try {
    const data = readFileSync(USERS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

function writeUsers(users: User[]) {
  ensureUsersFile()
  writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
}

export function getUserByEmail(email: string): User | null {
  const users = readUsers()
  return users.find((u) => u.email === email) || null
}

export function getUserById(id: string): User | null {
  const users = readUsers()
  return users.find((u) => u.id === id) || null
}

export function createUser(email: string, password: string, name: string): User {
  const users = readUsers()

  // Check if user already exists
  if (users.some((u) => u.email === email)) {
    throw new Error('User already exists')
  }

  const newUser: User = {
    id: Date.now().toString(),
    email,
    password, // In production, this should be hashed
    name,
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  writeUsers(users)

  return newUser
}

export function validateUser(email: string, password: string): User | null {
  const user = getUserByEmail(email)
  if (user && user.password === password) {
    return user
  }
  return null
}
