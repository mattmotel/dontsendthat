'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  Send,
  MoreHorizontal,
  Globe
} from 'lucide-react';
import { generateProfileAvatar } from '../utils/avatars';

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  profilePic: string;
}

export default function LinkedInInterface() {
  const [post, setPost] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateComments = async (postContent: string) => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate-comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post: postContent }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Check if we have valid comments data
      if (data.comments && Array.isArray(data.comments)) {
        // Animate comments coming in one by one
        const newComments = data.comments;
        for (let i = 0; i < newComments.length; i++) {
          setTimeout(() => {
            setComments(prev => [...prev, newComments[i]]);
          }, i * 1000); // 1 second delay between each comment
        }
      } else {
        console.error('Invalid response format:', data);
        // Show error state or fallback
      }
    } catch (error) {
      console.error('Error generating comments:', error);
      // You could add a fallback here or show an error message
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePost = async () => {
    if (!post.trim()) return;
    
    setIsPosting(true);
    setComments([]); // Clear previous comments
    
    // Simulate posting delay
    setTimeout(() => {
      setIsPosting(false);
      generateComments(post);
    }, 1500);
  };

  const clearPost = () => {
    setPost('');
    setComments([]);
  };

  return (
    <div className="flex max-w-7xl mx-auto gap-6 p-6">
      {/* Left Sidebar */}
      <div className="w-72 hidden xl:block space-y-4">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="h-16" style={{ background: 'linear-gradient(to right, #0467a8, #034f8a)' }}></div>
          <div className="px-4 pb-4">
            <div className="flex flex-col items-center -mt-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-sm border-4 border-white" style={{ background: 'linear-gradient(to right, #0467a8, #045a96)' }}>
                <span className="text-white font-bold text-lg">YU</span>
              </div>
              <h3 className="mt-2 font-semibold text-gray-900">You (Frustrated Professional)</h3>
              <p className="text-sm text-gray-600 text-center">Venting Expert | Cathartic Content Creator</p>
              <div className="w-full mt-3 pt-3 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Profile viewers</span>
                  <span className="font-semibold" style={{ color: '#0467a8' }}>42</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Post impressions</span>
                  <span className="font-semibold" style={{ color: '#0467a8' }}>1,337</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Recent Activity</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <p className="text-gray-900">You vented about micromanagement</p>
                <p className="text-gray-500">Got 47 validating responses</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
              <div>
                <p className="text-gray-900">Called out toxic culture</p>
                <p className="text-gray-500">127 people agreed</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
              <div>
                <p className="text-gray-900">Roasted thought leaders</p>
                <p className="text-gray-500">Epic thread ensued</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-2xl">
      {/* Create Post Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm" style={{ background: 'linear-gradient(to right, #0467a8, #045a96)' }}>
              <span className="text-white font-semibold text-sm">YU</span>
            </div>
            <div className="flex-1">
              <textarea
                value={post}
                onChange={(e) => setPost(e.target.value)}
                placeholder="What do you want to share? (Write that passive-aggressive post you've been holding back...)"
                className="w-full p-3 text-gray-900 placeholder-gray-500 resize-none border-none focus:outline-none focus:ring-0 text-base"
                rows={8}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex-1"></div>
            
            <div className="flex space-x-2">
              <button
                onClick={clearPost}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                Clear
              </button>
              <button
                onClick={handlePost}
                disabled={!post.trim() || isPosting || isGenerating}
                className="px-6 py-2 text-white rounded-full font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                style={{ backgroundColor: '#0467a8' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#045a96'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0467a8'}
              >
                {isPosting ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Post</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posted Content */}
      {(isPosting || post.trim() && comments.length > 0) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm" style={{ background: 'linear-gradient(to right, #0467a8, #045a96)' }}>
                <span className="text-white font-semibold text-sm">YU</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">You</span>
                    <span className="text-gray-500 text-sm">• 1st</span>
                    <span className="text-gray-500 text-sm">• Just now</span>
                    <Globe size={14} className="text-gray-500" />
                  </div>
                  <MoreHorizontal size={20} className="text-gray-500 hover:bg-gray-100 rounded p-1 cursor-pointer" />
                </div>
                <p className="text-sm text-gray-600">Software Engineer | Tech Enthusiast</p>
                <p className="mt-3 text-gray-900 whitespace-pre-wrap leading-relaxed">{post}</p>
              </div>
            </div>
            
            {isPosting && (
              <div className="mt-4 flex items-center space-x-2 text-gray-500">
                <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                <span className="text-sm">Publishing your post...</span>
              </div>
            )}
            
            {!isPosting && (
              <>
                {/* Engagement Stats */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <ThumbsUp size={14} className="text-blue-600" />
                        <span>{Math.floor(Math.random() * 50) + 10} likes</span>
                      </span>
                      <span>{comments.length} comments</span>
                    </div>
                    {isGenerating && (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                        <span>Generating responses...</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Engagement Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <button className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors flex-1 justify-center">
                      <ThumbsUp size={18} className="text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Like</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors flex-1 justify-center">
                      <MessageCircle size={18} className="text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Comment</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors flex-1 justify-center">
                      <Share2 size={18} className="text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Share</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Comment Loading State */}
      {isGenerating && comments.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="animate-spin w-5 h-5 border-2 border-t-transparent rounded-full" style={{ borderColor: '#0467a8', borderTopColor: 'transparent' }}></div>
            <span className="text-gray-700 font-medium">Your professional network is responding...</span>
          </div>
          <p className="text-gray-600 text-sm mt-2">People are engaging with your post.</p>
        </div>
      )}

      {/* Comments */}
      {comments.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Comments</h3>
            <div className="space-y-4">
              {comments.map((comment, index) => (
                <div
                  key={comment.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start space-x-3">
                    <Image 
                      src={generateProfileAvatar(comment.author, 32)} 
                      alt={comment.author}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="bg-gray-50 rounded-lg px-3 py-2">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-gray-900 text-sm">{comment.author}</span>
                          <span className="text-gray-500 text-xs">• {comment.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-900">{comment.content}</p>
                      </div>
                      <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                        <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                          <ThumbsUp size={12} />
                          <span>Like</span>
                        </button>
                        <button className="hover:text-blue-600 transition-colors">Reply</button>
                        <span className="text-gray-400">•</span>
                        <span>{Math.floor(Math.random() * 20) + 1} likes</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Right Sidebar */}
      <div className="w-80 hidden xl:block space-y-4">
        {/* News */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">News</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
              <div>
                <p className="text-gray-900 font-medium">Toxic positivity at all-time high</p>
                <p className="text-gray-500">2,847 readers • 4h ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
              <div>
                <p className="text-gray-900 font-medium">CEO posts another humble brag</p>
                <p className="text-gray-500">12,394 readers • 6h ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
              <div>
                <p className="text-gray-900 font-medium">&quot;Disrupt&quot; used 47,000 times today</p>
                <p className="text-gray-500">8,293 readers • 8h ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
              <div>
                <p className="text-gray-900 font-medium">Another &quot;game-changing&quot; SaaS launch</p>
                <p className="text-gray-500">5,729 readers • 12h ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trending Hashtags */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Trending in Venting</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-blue-600 font-medium">#MicromanagementSucks</span>
              <span className="text-gray-500">2.1k posts</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-600 font-medium">#ToxicWorkplace</span>
              <span className="text-gray-500">1.8k posts</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-600 font-medium">#ThoughtLeaderBS</span>
              <span className="text-gray-500">1.5k posts</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-600 font-medium">#CorporateCringe</span>
              <span className="text-gray-500">1.2k posts</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-600 font-medium">#HustleCultureToxic</span>
              <span className="text-gray-500">987 posts</span>
            </div>
          </div>
        </div>

        {/* People You May Want to Vent About */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">People you may want to vent about</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">MB</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Micromanaging Boss</p>
                <p className="text-sm text-gray-500">CEO at Anxiety Corp</p>
              </div>
              <button className="text-blue-600 text-sm font-medium">Vent</button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">TC</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Toxic Coworker</p>
                <p className="text-sm text-gray-500">Drama Specialist</p>
              </div>
              <button className="text-blue-600 text-sm font-medium">Vent</button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">TL</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Thought Leader</p>
                <p className="text-sm text-gray-500">Professional Buzzword Generator</p>
              </div>
              <button className="text-blue-600 text-sm font-medium">Vent</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
