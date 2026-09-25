'use client'

import { useState } from 'react'
import Link from 'next/link'
import { loginAction } from '@/lib/actions'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      await loginAction(formData)
    } catch (err: any) {
      if (err?.message?.includes('NEXT_REDIRECT')) {
        throw err
      }
      setError(err instanceof Error ? err.message : 'Login failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent mb-2">
              Fathom
            </h1>
            <p className="text-slate-400">Meeting Intelligence Platform</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                defaultValue="demo@fathom.com"
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                defaultValue="demo123"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-950/50 border border-red-900 text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium rounded-lg disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-indigo-500/25"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-900/50 text-slate-500">or</span>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-emerald-400 mb-2">Demo Credentials (pre-filled):</p>
            <p className="text-sm text-slate-400">Email: <span className="font-mono text-emerald-300">demo@fathom.com</span></p>
            <p className="text-sm text-slate-400">Password: <span className="font-mono text-emerald-300">demo123</span></p>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-slate-400">
            Don't have an account?{' '}
            <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
