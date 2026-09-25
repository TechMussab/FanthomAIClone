'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [teamSize, setTeamSize] = useState('')
  const [emails, setEmails] = useState([''])
  const [shareExisting, setShareExisting] = useState('private')
  const [shareNewByDefault, setShareNewByDefault] = useState(false)
  const [selectedCRM, setSelectedCRM] = useState('')
  const router = useRouter()

  const completeOnboarding = async () => {
    try {
      // Save onboarding data to database
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 'demo-user',
          team_size: teamSize,
          invited_emails: emails.filter(e => e.trim() !== ''),
          share_existing: shareExisting,
          share_new_by_default: shareNewByDefault,
          selected_crm: selectedCRM,
        }),
      })

      if (response.ok) {
        console.log('[Onboarding] Data saved to database successfully')
      } else {
        console.warn('[Onboarding] Failed to save to database, continuing anyway')
      }
    } catch (error) {
      console.error('[Onboarding] Error saving data:', error)
    }

    localStorage.setItem('fathom_onboarding_complete', 'true')
    router.push('/')
  }

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      await completeOnboarding()
    }
  }

  const addEmailField = () => {
    setEmails([...emails, ''])
  }

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...emails]
    newEmails[index] = value
    setEmails(newEmails)
  }

  const teamSizeOptions = ['1-5', '6-10', '11-20', '20+']
  const crmOptions = [
    { name: 'Salesforce', icon: '☁️' },
    { name: 'HubSpot', icon: '🔶' },
    { name: 'Close', icon: '📞' },
    { name: 'Gainsight', icon: '📊' },
    { name: 'Microsoft', icon: '🪟' },
    { name: 'Pipedrive', icon: '🔗' },
    { name: 'Attio', icon: '✨' },
    { name: 'Other', icon: '➕' },
    { name: 'None', icon: '❌' },
  ]

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Background accents */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative p-6 flex items-center justify-between border-b border-slate-800">
        <button
          onClick={completeOnboarding}
          className="text-sm text-slate-400 hover:text-slate-200 font-medium transition-colors"
        >
          EXIT SETUP
        </button>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-2 h-2 rounded-full transition-colors ${
                s <= step ? 'bg-indigo-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
      </header>

      {/* Content */}
      <div className="relative flex-1 flex items-center justify-center p-6">
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full backdrop-blur">
          {/* Step 1: Team Size */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-100 mb-2">
                  Welcome to Fathom! 👋
                </h1>
                <p className="text-slate-400">
                  How many people on your team could use Fathom?
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {teamSizeOptions.map((size) => (
                  <button
                    key={size}
                    onClick={() => setTeamSize(size)}
                    className={`p-6 border-2 rounded-lg text-center font-medium transition-all ${
                      teamSize === size
                        ? 'border-indigo-500 bg-indigo-950/30 text-indigo-300'
                        : 'border-slate-700 bg-slate-800/20 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    {size} people
                  </button>
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={!teamSize}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all shadow-lg hover:shadow-indigo-500/25"
              >
                Next
              </button>
            </div>
          )}

          {/* Step 2: Invite Colleagues */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-100 mb-2">
                  Invite your teammates
                </h1>
                <p className="text-slate-400">
                  Get your team started with Fathom today
                </p>
              </div>

              <div className="space-y-3">
                {emails.map((email, index) => (
                  <input
                    key={index}
                    type="email"
                    value={email}
                    onChange={(e) => updateEmail(index, e.target.value)}
                    placeholder="teammate@company.com"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                ))}
                <button
                  onClick={addEmailField}
                  className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
                >
                  + Add another email
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleNext}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-indigo-500/25"
                >
                  Send Invites
                </button>
                <button
                  onClick={handleNext}
                  className="text-slate-400 hover:text-slate-300 text-sm transition-colors"
                >
                  Skip and do this later
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Sharing Settings */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-100 mb-2">
                  Configure sharing settings
                </h1>
                <p className="text-slate-400">
                  Control how your meetings are shared
                </p>
              </div>

              <div className="space-y-6">
                {/* Share existing recordings */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Share existing external recordings
                  </label>
                  <select
                    value={shareExisting}
                    onChange={(e) => setShareExisting(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    <option value="private">Keep private</option>
                    <option value="team">Share with team</option>
                    <option value="public">Share publicly</option>
                  </select>
                </div>

                {/* Share new meetings toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-800/30 border border-slate-700 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-100">
                      Share new external meetings by default
                    </p>
                    <p className="text-sm text-slate-400">
                      Automatically share new recordings with your team
                    </p>
                  </div>
                  <button
                    onClick={() => setShareNewByDefault(!shareNewByDefault)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      shareNewByDefault ? 'bg-indigo-600' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        shareNewByDefault ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-indigo-500/25"
              >
                Next
              </button>
            </div>
          )}

          {/* Step 4: CRM Selection */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-100 mb-2">
                  Connect your CRM
                </h1>
                <p className="text-slate-400">
                  Sync your meetings with your favorite tools
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {crmOptions.map((crm) => (
                  <button
                    key={crm.name}
                    onClick={() => setSelectedCRM(crm.name)}
                    className={`p-6 border-2 rounded-lg text-center transition-all ${
                      selectedCRM === crm.name
                        ? 'border-emerald-500 bg-emerald-950/30'
                        : 'border-slate-700 bg-slate-800/20 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-3xl mb-2">{crm.icon}</div>
                    <div className={`text-sm font-medium ${
                      selectedCRM === crm.name ? 'text-emerald-300' : 'text-slate-300'
                    }`}>
                      {crm.name}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleNext}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-emerald-500/25"
              >
                Complete Setup
              </button>
            </div>
          )}

          {/* Step indicator text */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Step {step} of 4
          </p>
        </div>
      </div>
    </div>
  )
}
