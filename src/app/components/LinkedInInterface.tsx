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
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white font-semibold text-sm">YU</span>
            </div>
            <div className="flex-1">
              <textarea
                value={post}
                onChange={(e) => setPost(e.target.value)}
                placeholder="What do you want to share? (Write that passive-aggressive post you've been holding back...)"
                className="w-full p-3 text-gray-900 placeholder-gray-500 resize-none border-none focus:outline-none focus:ring-0 text-base"
                rows={4}
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
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-sm">
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
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span>{comments.length} comments</span>
                  {isGenerating && (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                      <span>Generating responses...</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Comments */}
      <div className="space-y-4">
        {comments.map((comment, index) => (
          <div
            key={comment.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {comment.author.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">{comment.author}</span>
                    <span className="text-gray-500 text-sm">• {comment.timestamp}</span>
                  </div>
                  <p className="mt-1 text-gray-900">{comment.content}</p>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <button className="hover:text-blue-600">👍 Like</button>
                    <button className="hover:text-blue-600">Reply</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
