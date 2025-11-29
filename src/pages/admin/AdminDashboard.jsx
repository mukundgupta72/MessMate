import React, { useState, useEffect } from 'react';
import { updateDailyMenu, subscribeToMenu } from '../../services/menuService';
import { getMealStatistics } from '../../services/mealService';
import { subscribeToFeedback, subscribeToComplaints } from '../../services/feedbackService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Save, Users, UtensilsCrossed, AlertCircle, MessageSquare } from 'lucide-react';

export default function AdminDashboard() {
  const [menu, setMenu] = useState({ breakfast: '', lunch: '', dinner: '' });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    breakfastCount: 0,
    lunchCount: 0,
    dinnerCount: 0,
    pendingFeedback: 0,
    pendingComplaints: 0
  });
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const unsubscribeMenu = subscribeToMenu((data) => {
      if (data) setMenu(data);
    });

    const unsubscribeFeedback = subscribeToFeedback((feedbacks) => {
      const pending = feedbacks.filter(f => f.status === 'pending').length;
      setStats(prev => ({ ...prev, pendingFeedback: pending }));
    });

    const unsubscribeComplaints = subscribeToComplaints((complaints) => {
      const pending = complaints.filter(c => c.status === 'pending').length;
      setStats(prev => ({ ...prev, pendingComplaints: pending }));
    });

    loadMealStats();

    return () => {
      unsubscribeMenu();
      unsubscribeFeedback();
      unsubscribeComplaints();
    };
  }, [selectedDate]);

  const loadMealStats = async () => {
    try {
      const mealStats = await getMealStatistics(selectedDate);
      setStats(prev => ({
        ...prev,
        breakfastCount: mealStats.breakfast,
        lunchCount: mealStats.lunch,
        dinnerCount: mealStats.dinner,
        totalStudents: mealStats.total
      }));
    } catch (error) {
      console.error('Failed to load meal statistics:', error);
    }
  };

  const handleChange = (e) => {
    setMenu({ ...menu, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateDailyMenu(menu);
      toast.success("Menu updated successfully!");
      await loadMealStats();
    } catch (error) {
      toast.error("Failed to update menu");
      console.error(error);
    }
    setLoading(false);
  };

  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Breakfast',
      value: stats.breakfastCount,
      icon: UtensilsCrossed,
      color: 'bg-orange-500'
    },
    {
      title: 'Lunch',
      value: stats.lunchCount,
      icon: UtensilsCrossed,
      color: 'bg-green-500'
    },
    {
      title: 'Dinner',
      value: stats.dinnerCount,
      icon: UtensilsCrossed,
      color: 'bg-purple-500'
    },
    {
      title: 'Pending Feedback',
      value: stats.pendingFeedback,
      icon: MessageSquare,
      color: 'bg-yellow-500'
    },
    {
      title: 'Pending Complaints',
      value: stats.pendingComplaints,
      icon: AlertCircle,
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Admin Control Center</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md border border-orange-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg shadow-sm`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Menu Editor */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
        <div className="flex justify-between items-center mb-6 border-b border-orange-100 pb-4">
          <h2 className="text-lg font-semibold text-gray-800">Update Daily Menu</h2>
          <input
            type="date"
            value={format(selectedDate, 'yyyy-MM-dd')}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
          />
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Breakfast Item
            </label>
            <input
              name="breakfast"
              value={menu.breakfast}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
              placeholder="e.g. Aloo Paratha, Tea"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lunch Item
            </label>
            <input
              name="lunch"
              value={menu.lunch}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
              placeholder="e.g. Rice, Dal, Curry"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dinner Item
            </label>
            <input
              name="dinner"
              value={menu.dinner}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
              placeholder="e.g. Roti, Sabji, Kheer"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition shadow-md hover:shadow-lg disabled:opacity-50"
            >
              <Save size={18} /> {loading ? 'Saving...' : 'Save Menu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
