import React, { useState } from 'react';
import { Plus, Heart, MessageCircle, HelpCircle, Trophy, Users } from 'lucide-react';
import { mockCommunityPosts } from '../../data/mock';

const CommunityForum = () => {
  const [posts, setPosts] = useState(mockCommunityPosts);
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'General'
  });

  const handleLikePost = (postId) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, likes: post.likes + 1 }
          : post
      )
    );
  };

  const handleNewPost = (e) => {
    e.preventDefault();
    const post = {
      id: Date.now(),
      author: 'Ahmed Rahman',
      avatar: 'AR',
      level: 'Blooming Gardener',
      time: 'Just now',
      ...newPost,
      likes: 0,
      replies: 0
    };
    setPosts(prevPosts => [post, ...prevPosts]);
    setNewPost({ title: '', content: '', category: 'General' });
    setShowModal(false);
  };

  const categories = ['General', 'Beginner Questions', 'Plant Care', 'Success Stories', 'Problems', 'DIY Projects', 'Seasonal Tips'];

  const getLevelBadgeColor = (level) => {
    if (level.includes('Master')) return 'bg-purple-100 text-purple-800';
    if (level.includes('Expert')) return 'bg-blue-100 text-blue-800';
    if (level.includes('Blooming')) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'General': 'bg-gray-100 text-gray-800',
      'Beginner Questions': 'bg-green-100 text-green-800',
      'Plant Care': 'bg-blue-100 text-blue-800',
      'Success Stories': 'bg-yellow-100 text-yellow-800',
      'Problems': 'bg-red-100 text-red-800',
      'DIY Projects': 'bg-purple-100 text-purple-800',
      'Seasonal Tips': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Content - Posts Feed */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Community Forum</h1>
              <p className="text-gray-600 mt-1">Connect with 10,000+ gardeners across Bangladesh</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>New Post</span>
            </button>
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                {/* Post Header */}
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {post.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{post.author}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelBadgeColor(post.level)}`}>
                        {post.level}
                      </span>
                      <span className="text-sm text-gray-500">{post.time}</span>
                    </div>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{post.content}</p>
                </div>

                {/* Post Actions */}
                <div className="flex items-center space-x-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleLikePost(post.id)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <Heart className="h-5 w-5" />
                    <span className="font-medium">{post.likes}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
                    <MessageCircle className="h-5 w-5" />
                    <span className="font-medium">{post.replies} replies</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors">
                    <HelpCircle className="h-5 w-5" />
                    <span className="font-medium">Helpful</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Community Stats */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Community Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-700">Active Members</span>
                </div>
                <span className="font-bold text-gray-900">10,234</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Posts This Week</span>
                </div>
                <span className="font-bold text-gray-900">1,456</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <HelpCircle className="h-5 w-5 text-purple-500" />
                  <span className="text-gray-700">Questions Answered</span>
                </div>
                <span className="font-bold text-gray-900">892</span>
              </div>
            </div>
          </div>

          {/* Gardener of the Month */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Trophy className="h-6 w-6" />
              <h3 className="text-lg font-bold">Gardener of the Month</h3>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-yellow-200 font-bold">
                FK
              </div>
              <div>
                <p className="font-semibold">Fatima Khan</p>
                <p className="text-yellow-100 text-sm">Helped 47 gardeners this month</p>
              </div>
            </div>
          </div>

          {/* Popular Categories */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Popular Categories</h3>
            <div className="space-y-3">
              {categories.slice(0, 5).map((category, index) => (
                <div key={category} className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(category)}`}>
                    {category}
                  </span>
                  <span className="text-sm text-gray-500">{Math.floor(Math.random() * 100) + 20}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* New Post Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create New Post</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleNewPost} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="What's your question or topic?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Share your gardening question, tip, or experience..."
                  required
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1 py-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 py-3"
                >
                  Post to Community
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityForum;