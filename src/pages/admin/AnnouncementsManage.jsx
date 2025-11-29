import React, { useState, useEffect } from 'react';
import { createAnnouncement, getAllAnnouncements, toggleAnnouncement, deleteAnnouncement, subscribeToAnnouncements } from '../../services/announcementService';
import { Plus, Trash2, Power, PowerOff } from 'lucide-react';
import toast from 'react-hot-toast';
import AnnouncementCard from '../../components/ui/AnnouncementCard';

export default function AnnouncementsManage() {
  const [announcements, setAnnouncements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    priority: 'normal'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAnnouncements((data) => {
      setAnnouncements(data);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await createAnnouncement(formData.title, formData.message, formData.priority);
      toast.success('Announcement created successfully!');
      setFormData({ title: '', message: '', priority: 'normal' });
      setShowForm(false);
    } catch (error) {
      toast.error('Failed to create announcement');
      console.error(error);
    }
    setLoading(false);
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      await toggleAnnouncement(id, !currentStatus);
      toast.success(`Announcement ${!currentStatus ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error('Failed to update announcement');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    
    try {
      await deleteAnnouncement(id);
      toast.success('Announcement deleted');
    } catch (error) {
      toast.error('Failed to delete announcement');
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Manage Announcements</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition shadow-md hover:shadow-lg"
        >
          <Plus size={20} />
          New Announcement
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Create New Announcement</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                placeholder="Announcement title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                placeholder="Announcement message"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Announcement'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* All Announcements */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">All Announcements</h2>
        {announcements.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No announcements yet
          </p>
        ) : (
          announcements.map((announcement) => (
            <div key={announcement.id} className="relative">
              <AnnouncementCard announcement={announcement} />
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => handleToggle(announcement.id, announcement.isActive)}
                  className="p-2 rounded hover:bg-gray-100 transition"
                  title={announcement.isActive ? 'Deactivate' : 'Activate'}
                >
                  {announcement.isActive ? (
                    <PowerOff size={18} className="text-gray-600" />
                  ) : (
                    <Power size={18} className="text-green-600" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(announcement.id)}
                  className="p-2 rounded hover:bg-red-100 transition"
                  title="Delete"
                >
                  <Trash2 size={18} className="text-red-600" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

