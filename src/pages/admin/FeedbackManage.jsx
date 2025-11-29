import React, { useState, useEffect } from 'react';
import { subscribeToFeedback, subscribeToComplaints, updateComplaintStatus } from '../../services/feedbackService';
import { MessageSquare, AlertCircle, CheckCircle2, Clock, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FeedbackManage() {
  const [activeTab, setActiveTab] = useState('feedback');
  const [feedback, setFeedback] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribeFeedback = subscribeToFeedback((data) => {
      setFeedback(data);
    });

    const unsubscribeComplaints = subscribeToComplaints((data) => {
      setComplaints(data);
    });

    return () => {
      unsubscribeFeedback();
      unsubscribeComplaints();
    };
  }, []);

  const handleResolveComplaint = async (complaintId, status) => {
    setLoading(true);
    try {
      await updateComplaintStatus(complaintId, status, responseText || null);
      toast.success(`Complaint marked as ${status}`);
      setSelectedComplaint(null);
      setResponseText('');
    } catch (error) {
      toast.error('Failed to update complaint');
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

  const pendingFeedback = feedback.filter(f => f.status === 'pending');
  const pendingComplaints = complaints.filter(c => c.status === 'pending');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Feedback & Complaints Management</h1>
        <div className="flex gap-2">
          {pendingFeedback.length > 0 && (
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
              {pendingFeedback.length} Pending Feedback
            </span>
          )}
          {pendingComplaints.length > 0 && (
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              {pendingComplaints.length} Pending Complaints
            </span>
          )}
        </div>
      </div>

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
          Feedback ({feedback.length})
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
          Complaints ({complaints.length})
        </button>
      </div>

      {/* Feedback Tab */}
      {activeTab === 'feedback' && (
        <div className="space-y-4">
          {feedback.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No feedback submitted yet
            </p>
          ) : (
            feedback.map((item) => (
              <div
                key={item.id}
                className="bg-white p-6 rounded-xl shadow-md border border-orange-100"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-gray-800">{item.userEmail}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {getStatusBadge(item.status)}
                </div>
                <p className="text-gray-700">{item.feedback}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Complaints Tab */}
      {activeTab === 'complaints' && (
        <div className="space-y-4">
          {complaints.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No complaints submitted yet
            </p>
          ) : (
            complaints.map((item) => (
              <div
                key={item.id}
                className="bg-white p-6 rounded-xl shadow-md border border-orange-100"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-800">{item.userEmail}</p>
                      <span className="text-xs font-medium text-orange-600 uppercase">
                        {item.category.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {getStatusBadge(item.status)}
                </div>
                
                <p className="text-gray-700 mb-4">{item.complaint}</p>
                
                {item.adminResponse && (
                  <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm font-medium text-green-800 mb-1">
                      Admin Response:
                    </p>
                    <p className="text-sm text-green-700">{item.adminResponse}</p>
                  </div>
                )}

                {item.status !== 'resolved' && (
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => setSelectedComplaint(item)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition shadow-md hover:shadow-lg text-sm"
                    >
                      Respond
                    </button>
                    <button
                      onClick={() => handleResolveComplaint(item.id, 'resolved')}
                      disabled={loading}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition shadow-md hover:shadow-lg disabled:opacity-50 text-sm"
                    >
                      Mark as Resolved
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Response Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Respond to Complaint</h3>
              <button
                onClick={() => {
                  setSelectedComplaint(null);
                  setResponseText('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Complaint from: {selectedComplaint.userEmail}
              </p>
              <p className="text-sm text-gray-700">
                {selectedComplaint.complaint}
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Response
              </label>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                placeholder="Type your response here..."
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => handleResolveComplaint(selectedComplaint.id, 'resolved')}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save & Resolve'}
              </button>
              <button
                onClick={() => {
                  setSelectedComplaint(null);
                  setResponseText('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

