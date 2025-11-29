import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { submitFeedback, submitComplaint, getUserFeedback } from '../../services/feedbackService';
import { MessageSquare, AlertCircle, CheckCircle2, Clock, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FeedbackComplaints() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('feedback');
  const [feedbackText, setFeedbackText] = useState('');
  const [complaintText, setComplaintText] = useState('');
  const [complaintCategory, setComplaintCategory] = useState('general');
  const [loading, setLoading] = useState(false);
  const [userSubmissions, setUserSubmissions] = useState({ feedback: [], complaints: [] });

  useEffect(() => {
    loadUserSubmissions();
  }, [currentUser]);

  const loadUserSubmissions = async () => {
    if (!currentUser) return;
    try {
      const submissions = await getUserFeedback(currentUser.uid);
      setUserSubmissions(submissions);
    } catch (error) {
      console.error('Failed to load submissions:', error);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) {
      toast.error('Please enter your feedback');
      return;
    }

    setLoading(true);
    try {
      await submitFeedback(currentUser.uid, currentUser.email, feedbackText);
      setFeedbackText('');
      toast.success('✅ Feedback submitted! Thank you for your input.');
      await loadUserSubmissions();
    } catch (error) {
      toast.error('Failed to submit feedback');
      console.error(error);
    }
    setLoading(false);
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    if (!complaintText.trim()) {
      toast.error('Please enter your complaint');
      return;
    }

    setLoading(true);
    try {
      await submitComplaint(currentUser.uid, currentUser.email, complaintText, complaintCategory);
      setComplaintText('');
      toast.success('✅ Complaint submitted! Admin will review it soon.');
      await loadUserSubmissions();
    } catch (error) {
      toast.error('Failed to submit complaint');
      console.error(error);
    }
    setLoading(false);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
      resolved: { icon: CheckCircle2, color: 'bg-green-100 text-green-800' },
      reviewing: { icon: Clock, color: 'bg-blue-100 text-blue-800' }
    };
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Feedback & Complaints</h1>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-orange-100">
        <button
          onClick={() => setActiveTab('feedback')}
          className={`pb-3 px-4 font-medium transition ${
            activeTab === 'feedback'
              ? 'text-orange-600 border-b-2 border-orange-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <MessageSquare size={18} className="inline mr-2" />
          Suggestions/Feedback
        </button>
        <button
          onClick={() => setActiveTab('complaints')}
          className={`pb-3 px-4 font-medium transition ${
            activeTab === 'complaints'
              ? 'text-orange-600 border-b-2 border-orange-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <AlertCircle size={18} className="inline mr-2" />
          Complaints
        </button>
      </div>

      {/* Feedback Tab */}
      {activeTab === 'feedback' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Submit Feedback Form */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Submit Feedback</h2>
            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Feedback
                </label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={6}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                  placeholder="Share your suggestions or feedback about the mess..."
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send size={18} />
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          </div>

          {/* User's Previous Feedback */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Your Feedback History</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {userSubmissions.feedback.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">
                  No feedback submitted yet
                </p>
              ) : (
                userSubmissions.feedback.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <p className="text-sm text-gray-700 mb-2">{item.feedback}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      {getStatusBadge(item.status)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Complaints Tab */}
      {activeTab === 'complaints' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Submit Complaint Form */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Submit Complaint</h2>
            <form onSubmit={handleSubmitComplaint} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={complaintCategory}
                  onChange={(e) => setComplaintCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                >
                  <option value="general">General</option>
                  <option value="food_quality">Food Quality</option>
                  <option value="service">Service</option>
                  <option value="timing">Timing</option>
                  <option value="hygiene">Hygiene</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Complaint Details
                </label>
                <textarea
                  value={complaintText}
                  onChange={(e) => setComplaintText(e.target.value)}
                  rows={6}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                  placeholder="Describe your complaint in detail..."
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-2 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send size={18} />
                {loading ? 'Submitting...' : 'Submit Complaint'}
              </button>
            </form>
          </div>

          {/* User's Previous Complaints */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Your Complaints</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {userSubmissions.complaints.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">
                  No complaints submitted yet
                </p>
              ) : (
                userSubmissions.complaints.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-orange-600 uppercase">
                        {item.category.replace('_', ' ')}
                      </span>
                      {getStatusBadge(item.status)}
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{item.complaint}</p>
                    {item.adminResponse && (
                      <div className="mt-2 p-2 bg-green-50 rounded text-xs border border-green-200">
                        <strong>Admin Response:</strong> {item.adminResponse}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-2">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

