'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  Send, 
  Paperclip, 
  Link, 
  Smile, 
  Minimize2, 
  Maximize2, 
  X,
  Mail
} from 'lucide-react';
import { generateProfileAvatar } from '../utils/avatars';

interface EmailResponse {
  id: string;
  from: string;
  subject: string;
  content: string;
  timestamp: string;
}

export default function GmailInterface() {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState<EmailResponse | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateResponse = async (emailContent: { to: string; subject: string; body: string }) => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate-email-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailContent),
      });
      
      const data = await response.json();
      
      // Simulate email response delay
      setTimeout(() => {
        setResponse(data.response);
        setIsGenerating(false);
      }, 2000);
    } catch (error) {
      console.error('Error generating response:', error);
      setIsGenerating(false);
    }
  };

  const handleSend = async () => {
    if (!to.trim() || !subject.trim() || !body.trim()) return;
    
    setIsSending(true);
    setResponse(null);
    
    // Simulate sending delay
    setTimeout(() => {
      setIsSending(false);
      generateResponse({ to, subject, body });
    }, 1500);
  };

  const clearEmail = () => {
    setTo('');
    setSubject('');
    setBody('');
    setResponse(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Gmail Header */}
      <div className="bg-white dark:bg-gray-800 rounded-t-lg border border-gray-200 dark:border-gray-700 border-b-0">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Compose</h2>
          <div className="flex items-center space-x-1">
            <button className="p-2 hover:bg-gray-100 rounded">
              <Minimize2 size={16} className="text-gray-500 dark:text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
              <Maximize2 size={16} className="text-gray-500 dark:text-gray-400" />
            </button>
            <button onClick={clearEmail} className="p-2 hover:bg-gray-100 rounded">
              <X size={16} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Compose Email */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-b-lg shadow-sm">
        <div className="p-4 space-y-4">
          {/* To Field */}
          <div className="flex items-center">
            <label className="w-16 text-sm text-gray-700 dark:text-gray-300 font-medium">To</label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="that.annoying.coworker@company.com"
              className="flex-1 px-2 py-1 text-sm text-gray-900 dark:text-white border-b border-gray-200 focus:border-blue-500 focus:outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
          </div>

          {/* Subject Field */}
          <div className="flex items-center">
            <label className="w-16 text-sm text-gray-700 dark:text-gray-300 font-medium">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Re: Your completely unreasonable request"
              className="flex-1 px-2 py-1 text-sm text-gray-900 dark:text-white border-b border-gray-200 focus:border-blue-500 focus:outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
          </div>

          {/* Body */}
          <div className="mt-4">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Dear [Name],

I hope this email finds you well, though frankly I don't care...

Write that passive-aggressive email you've been drafting in your head for weeks. Let it all out - you're not actually sending this!"
              className="w-full h-64 p-3 text-sm text-gray-900 dark:text-white border border-gray-200 rounded focus:border-blue-500 focus:outline-none resize-none placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
          </div>

          {/* Send Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <button
                  onClick={handleSend}
                  disabled={!to.trim() || !subject.trim() || !body.trim() || isSending || isGenerating}
                  className="px-6 py-2 bg-blue-600 text-white rounded font-medium text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSending ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Send</span>
                    </>
                  )}
                </button>
              
              <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                <button className="p-2 hover:bg-gray-100 rounded" title="Attach file">
                  <Paperclip size={18} />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded" title="Insert link">
                  <Link size={18} />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded" title="Insert emoji">
                  <Smile size={18} />
                </button>
              </div>
            </div>

            <button
              onClick={clearEmail}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 text-sm"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Sending Status */}
      {isSending && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin w-5 h-5 border-2 border-yellow-600 border-t-transparent rounded-full"></div>
            <span className="text-yellow-800">Sending your email...</span>
          </div>
        </div>
      )}

      {/* Response Generation Status */}
      {isGenerating && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            <span className="text-blue-800">Waiting for a satisfying response...</span>
          </div>
        </div>
      )}

      {/* Email Response */}
      {response && (
        <div className="mt-6 animate-fade-in">
          <div className="bg-green-50 border border-green-200 rounded-t-lg p-4">
            <div className="flex items-center space-x-2">
              <span className="text-green-800 font-medium">✓ Email sent successfully!</span>
              <span className="text-green-600 text-sm">(Not really, but it felt good, right?)</span>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 border-t-0 rounded-b-lg shadow-sm">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Response Received:</h3>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Image 
                      src={generateProfileAvatar(response.from, 40)} 
                      alt={response.from}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full shadow-sm"
                    />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">{response.from}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                        <Mail size={14} />
                        <span>{response.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject: </span>
                  <span className="text-sm text-gray-900 dark:text-gray-100">{response.subject}</span>
                </div>
                
                <div className="mt-3 text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                  {response.content}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
