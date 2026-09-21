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

  const completeOnboarding = () => {
    localStorage.setItem('fathom_onboarding_complete', 'true')
    router.push('/')
  }

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      completeOnboarding()
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="p-6 flex items-center justify-between">
        <button
          onClick={completeOnboarding}
          className="text-sm text-gray-600 hover:text-gray-900 font-medium"
        >
          EXIT SETUP
        </button>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-2 h-2 rounded-full ${
                s <= step ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
          {/* Step 1: Team Size */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome to Fathom! 👋
                </h1>
                <p className="text-gray-600">
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
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {size} people
                  </button>
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={!teamSize}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Next
              </button>
            </div>
          )}

          {/* Step 2: Invite Colleagues */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Invite your teammates
                </h1>
                <p className="text-gray-600">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ))}
                <button
                  onClick={addEmailField}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Add another email
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleNext}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Send Invites
                </button>
                <button
                  onClick={handleNext}
                  className="text-gray-600 hover:text-gray-900 text-sm"
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Configure sharing settings
                </h1>
                <p className="text-gray-600">
                  Control how your meetings are shared
                </p>
              </div>

              <div className="space-y-6">
                {/* Share existing recordings */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Share existing external recordings
                  </label>
                  <select
                    value={shareExisting}
                    onChange={(e) => setShareExisting(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="private">Keep private</option>
                    <option value="team">Share with team</option>
                    <option value="public">Share publicly</option>
                  </select>
                </div>

                {/* Share new meetings toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      Share new external meetings by default
                    </p>
                    <p className="text-sm text-gray-600">
                      Automatically share new recordings with your team
                    </p>
                  </div>
                  <button
                    onClick={() => setShareNewByDefault(!shareNewByDefault)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      shareNewByDefault ? 'bg-blue-600' : 'bg-gray-300'
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
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Next
              </button>
            </div>
          )}

          {/* Step 4: CRM Selection */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Connect your CRM
                </h1>
                <p className="text-gray-600">
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
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{crm.icon}</div>
                    <div className="text-sm font-medium text-gray-900">
                      {crm.name}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleNext}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Complete Setup
              </button>
            </div>
          )}

          {/* Step indicator text */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Step {step} of 4
          </p>
        </div>
      </div>
    </div>
  )
}
