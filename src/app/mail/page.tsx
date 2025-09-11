'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Users, Mail } from 'lucide-react';
import Image from 'next/image';
import LinkedInInterface from '../components/LinkedInInterface';
import GmailInterface from '../components/GmailInterface';

export default function MailPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<'linkedin' | 'gmail'>('gmail');

  // Sync tab state with URL
  useEffect(() => {
    if (pathname === '/mail') {
      setActiveTab('gmail');
    } else {
      setActiveTab('linkedin');
    }
  }, [pathname]);

  const handleTabChange = (tab: 'linkedin' | 'gmail') => {
    setActiveTab(tab);
    if (tab === 'gmail') {
      router.push('/mail');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              {activeTab === 'linkedin' ? (
                <Image
                  src="/li-logo.png"
                  alt="LinkedIn"
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                />
              ) : (
                <Image
                  src="/gm-logo.png"
                  alt="Gmail"
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                />
              )}
            </div>
            
            {/* Tab Navigation */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleTabChange('linkedin')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                  activeTab === 'linkedin'
                    ? 'bg-white shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                style={activeTab === 'linkedin' ? { color: '#0467a8' } : {}}
              >
                <Users size={16} />
                <span>Social</span>
              </button>
              <button
                onClick={() => handleTabChange('gmail')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                  activeTab === 'gmail'
                    ? 'bg-white text-red-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Mail size={16} />
                <span>Mail</span>
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
