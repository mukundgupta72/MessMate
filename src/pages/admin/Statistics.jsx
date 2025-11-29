import React, { useState, useEffect } from 'react';
import { getMealStatistics, getAllMealSelectionsForDate } from '../../services/mealService';
import { getAllFeedback, getAllComplaints } from '../../services/feedbackService';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { BarChart3, Users, TrendingUp, Calendar } from 'lucide-react';

export default function Statistics() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateRange, setDateRange] = useState('today');
  const [stats, setStats] = useState({
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    total: 0
  });
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [complaintCount, setComplaintCount] = useState(0);

  useEffect(() => {
    loadStatistics();
  }, [selectedDate, dateRange]);

  const loadStatistics = async () => {
    try {
      if (dateRange === 'today') {
        const mealStats = await getMealStatistics(selectedDate);
        setStats(mealStats);
      } else if (dateRange === 'week') {
        const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
        const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
        const days = eachDayOfInterval({ start, end });
        
        const weeklyData = await Promise.all(
          days.map(async (day) => {
            const dayStats = await getMealStatistics(day);
            return {
              date: format(day, 'yyyy-MM-dd'),
              label: format(day, 'EEE'),
              ...dayStats
            };
          })
        );
        setWeeklyStats(weeklyData);
        
        // Set today's stats
        const todayStats = await getMealStatistics(selectedDate);
        setStats(todayStats);
      }
      
      // Load feedback and complaints
      const [feedbacks, complaints] = await Promise.all([
        getAllFeedback(),
        getAllComplaints()
      ]);
      setFeedbackCount(feedbacks.length);
      setComplaintCount(complaints.length);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  const totalMealsSelected = stats.breakfast + stats.lunch + stats.dinner;
  const averagePerMeal = stats.total > 0 ? (totalMealsSelected / (stats.total * 3) * 100).toFixed(1) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Statistics & Analytics</h1>
        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
          </select>
          {dateRange === 'today' && (
            <input
              type="date"
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
            />
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Students</span>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Meal Selection Rate</span>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{averagePerMeal}%</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Feedback</span>
            <BarChart3 className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{feedbackCount}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Complaints</span>
            <BarChart3 className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{complaintCount}</p>
        </div>
      </div>

      {/* Meal Statistics */}
      {dateRange === 'today' ? (
        <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Meal Selection for {format(selectedDate, 'MMMM dd, yyyy')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
              <p className="text-sm text-gray-600 mb-1">Breakfast</p>
              <p className="text-2xl font-bold text-orange-600">{stats.breakfast}</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600 mb-1">Lunch</p>
              <p className="text-2xl font-bold text-green-600">{stats.lunch}</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Dinner</p>
              <p className="text-2xl font-bold text-blue-600">{stats.dinner}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Weekly Meal Statistics</h2>
          <div className="grid grid-cols-7 gap-2">
            {weeklyStats.map((day) => (
              <div key={day.date} className="text-center">
                <p className="text-xs text-gray-600 mb-2 font-medium">{day.label}</p>
                <div className="space-y-1">
                  <div className="p-2 bg-gradient-to-b from-orange-50 to-amber-50 rounded border border-orange-200">
                    <p className="text-xs text-gray-600">B</p>
                    <p className="font-bold text-orange-600">{day.breakfast}</p>
                  </div>
                  <div className="p-2 bg-gradient-to-b from-green-50 to-emerald-50 rounded border border-green-200">
                    <p className="text-xs text-gray-600">L</p>
                    <p className="font-bold text-green-600">{day.lunch}</p>
                  </div>
                  <div className="p-2 bg-gradient-to-b from-blue-50 to-indigo-50 rounded border border-blue-200">
                    <p className="text-xs text-gray-600">D</p>
                    <p className="font-bold text-blue-600">{day.dinner}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

