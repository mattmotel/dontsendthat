'use client';

import { useState } from 'react';
import LinkedInInterface from './components/LinkedInInterface';
import GmailInterface from './components/GmailInterface';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'linkedin' | 'gmail'>('linkedin');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">Don't Send That</h1>
              <span className="text-sm text-gray-500">Cathartic fake responses</span>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('linkedin')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'linkedin'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                LinkedIn
              </button>
              <button
                onClick={() => setActiveTab('gmail')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'gmail'
                    ? 'bg-white text-red-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Gmail
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        {activeTab === 'linkedin' && <LinkedInInterface />}
        {activeTab === 'gmail' && <GmailInterface />}
      </div>
    </div>
  );
}
