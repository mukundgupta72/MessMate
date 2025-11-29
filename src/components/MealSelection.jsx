import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { submitMealSelection, subscribeToMealSelection } from '../services/mealService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Calendar, CheckCircle2, Circle } from 'lucide-react';

export default function MealSelection() {
  const { currentUser } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selections, setSelections] = useState({
    breakfast: false,
    lunch: false,
    dinner: false
  });
  const [loading, setLoading] = useState(false);
  const [currentSelection, setCurrentSelection] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    
    // Subscribe to real-time updates for selected date
    const unsubscribe = subscribeToMealSelection(
      currentUser.uid,
      selectedDate,
      (data) => {
        if (data) {
          setCurrentSelection(data);
          setSelections(data.selections || { breakfast: false, lunch: false, dinner: false });
        } else {
          setCurrentSelection(null);
          setSelections({ breakfast: false, lunch: false, dinner: false });
        }
      }
    );

    return () => unsubscribe();
  }, [currentUser, selectedDate]);

  const handleToggle = (meal) => {
    setSelections(prev => ({
      ...prev,
      [meal]: !prev[meal]
    }));
  };

  const handleSave = async () => {
    if (!currentUser) return;
    
    const mealCount = Object.values(selections).filter(Boolean).length;
    if (mealCount === 0) {
      toast.error('Please select at least one meal');
      return;
    }

    setLoading(true);
    try {
      await submitMealSelection(currentUser.uid, selectedDate, selections);
      toast.success(`✅ Successfully selected ${mealCount} meal(s)!`);
    } catch (error) {
      toast.error('Failed to save meal selection');
      console.error(error);
    }
    setLoading(false);
  };

  const canSelectDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(date);
    selected.setHours(0, 0, 0, 0);
    // Can select today and future dates (up to 7 days ahead)
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 7);
    return selected >= today && selected <= maxDate;
  };

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    if (canSelectDate(newDate)) {
      setSelectedDate(newDate);
    }
  };

  const mealOptions = [
    { key: 'breakfast', label: 'Breakfast', time: '7:30 - 9:00 AM', icon: '🌅' },
    { key: 'lunch', label: 'Lunch', time: '12:30 - 2:00 PM', icon: '🍽️' },
    { key: 'dinner', label: 'Dinner', time: '7:30 - 9:00 PM', icon: '🌙' }
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
          <Calendar className="text-orange-500" />
          Meal Selection
        </h2>
        <input
          type="date"
          value={format(selectedDate, 'yyyy-MM-dd')}
          onChange={handleDateChange}
          min={format(new Date(), 'yyyy-MM-dd')}
          max={format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')}
          className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
        />
      </div>

      <div className="space-y-3 mb-6">
        {mealOptions.map((meal) => (
          <div
            key={meal.key}
            onClick={() => handleToggle(meal.key)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all shadow-sm hover:shadow-md ${
              selections[meal.key]
                ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50'
                : 'border-gray-200 bg-gray-50 hover:border-orange-300 hover:bg-orange-50/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{meal.icon}</span>
                <div>
                  <div className="font-semibold text-gray-800">
                    {meal.label}
                  </div>
                  <div className="text-sm text-gray-600">
                    {meal.time}
                  </div>
                </div>
              </div>
              {selections[meal.key] ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : (
                <Circle className="w-6 h-6 text-gray-400" />
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-bold hover:from-orange-600 hover:to-orange-700 transition shadow-md hover:shadow-lg disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Selection'}
      </button>

      {currentSelection && (
        <p className="text-sm text-gray-500 mt-3 text-center">
          Last updated: {new Date(currentSelection.updatedAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}

