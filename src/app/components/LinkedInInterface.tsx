'use client';

import { useState } from 'react';
import { 
  Camera, 
  Video, 
  BarChart3, 
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
      
      const data = await response.json();
      
      // Animate comments coming in one by one
      const newComments = data.comments;
      for (let i = 0; i < newComments.length; i++) {
        setTimeout(() => {
          setComments(prev => [...prev, newComments[i]]);
        }, i * 1000); // 1 second delay between each comment
      }
    } catch (error) {
      console.error('Error generating comments:', error);
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
    <div className="p-6 max-w-2xl mx-auto">
      {/* Create Post Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-4">
          <div className="flex items-start space-x-3">
            <img 
              src={generateProfileAvatar('You', 48)} 
              alt="Your profile"
              className="w-12 h-12 rounded-full shadow-sm"
            />
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
            <div className="flex items-center space-x-6 text-gray-600">
              <button className="flex items-center space-x-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                <Camera size={20} className="text-blue-600" />
                <span className="text-sm font-medium">Photo</span>
              </button>
              <button className="flex items-center space-x-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                <Video size={20} className="text-green-600" />
                <span className="text-sm font-medium">Video</span>
              </button>
              <button className="flex items-center space-x-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                <BarChart3 size={20} className="text-orange-500" />
                <span className="text-sm font-medium">Poll</span>
              </button>
            </div>
            
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
                className="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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
              <img 
                src={generateProfileAvatar('You', 48)} 
                alt="Your profile"
                className="w-12 h-12 rounded-full shadow-sm"
              />
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
                    <img 
                      src={generateProfileAvatar(comment.author, 32)} 
                      alt={comment.author}
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
  );
}
