import React, { useEffect, useState } from 'react';
import { subscribeToMenu } from '../../services/menuService';
import { subscribeToAnnouncements } from '../../services/announcementService';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, Bell } from 'lucide-react';
import MealSelection from '../../components/MealSelection';
import AnnouncementCard from '../../components/ui/AnnouncementCard';
import ErrorBoundary from '../../components/ErrorBoundary';

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const [menu, setMenu] = useState({ breakfast: '', lunch: '', dinner: '' });
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    
    let unsubscribeMenu = null;
    let unsubscribeAnnouncements = null;

    try {
      // Subscribe to real-time menu updates
      unsubscribeMenu = subscribeToMenu((data) => {
        if (data) setMenu(data);
      }, (err) => {
        console.error('Menu subscription error:', err);
        setError(err.message);
      });

      // Subscribe to announcements
      unsubscribeAnnouncements = subscribeToAnnouncements((data) => {
        setAnnouncements(Array.isArray(data) ? data : []);
        // Don't show notifications - they're annoying
      }, (err) => {
        console.error('Announcements subscription error:', err);
        // Don't set error for announcements - it's not critical
      });
    } catch (err) {
      console.error('Error setting up subscriptions:', err);
      setError(err.message);
    }

    return () => {
      if (unsubscribeMenu) unsubscribeMenu();
      if (unsubscribeAnnouncements) unsubscribeAnnouncements();
    };
  }, [currentUser]);

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-4 shadow-sm">
          <p className="text-amber-800">⚠️ Warning: {error}. Some features may not work correctly.</p>
        </div>
      )}
      {/* Announcements */}
      {announcements && announcements.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
            <Bell className="text-orange-500" />
            Announcements
          </h2>
          {announcements.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="space-y-6">
          {/* Today's Menu */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
              <Calendar className="text-orange-500" />
              Today's Menu
            </h2>
            <div className="space-y-4">
              {/* Breakfast */}
              <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-orange-700">Breakfast</span>
                  <span className="text-xs flex items-center gap-1 text-orange-600">
                    <Clock size={12} /> 7:30 - 9:00 AM
                  </span>
                </div>
                <p className="text-gray-700">
                  {menu.breakfast || "Not updated yet"}
                </p>
              </div>

              {/* Lunch */}
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-green-700">Lunch</span>
                  <span className="text-xs flex items-center gap-1 text-green-600">
                    <Clock size={12} /> 12:30 - 2:00 PM
                  </span>
                </div>
                <p className="text-gray-700">
                  {menu.lunch || "Not updated yet"}
                </p>
              </div>

              {/* Dinner */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-blue-700">Dinner</span>
                  <span className="text-xs flex items-center gap-1 text-blue-600">
                    <Clock size={12} /> 7:30 - 9:00 PM
                  </span>
                </div>
                <p className="text-gray-700">
                  {menu.dinner || "Not updated yet"}
                </p>
              </div>
            </div>
          </div>

        {/* Meal Selection */}
        <ErrorBoundary>
          <MealSelection />
        </ErrorBoundary>
      </div>
    </div>
  );
}
