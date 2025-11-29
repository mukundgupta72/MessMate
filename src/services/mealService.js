import { db } from '../config/firebase';
import { doc, setDoc, getDoc, collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { format } from 'date-fns';

// Get date string in YYYY-MM-DD format
const getDateString = (date = new Date()) => {
  return format(date, 'yyyy-MM-dd');
};

// Submit meal selection for a specific date
export const submitMealSelection = async (userId, date, selections) => {
  const dateStr = getDateString(date);
  const mealRef = doc(db, 'meal_selections', `${userId}_${dateStr}`);
  
  await setDoc(mealRef, {
    userId,
    date: dateStr,
    selections, // { breakfast: true/false, lunch: true/false, dinner: true/false }
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }, { merge: true });
};

// Get meal selection for a specific date
export const getMealSelection = async (userId, date) => {
  const dateStr = getDateString(date);
  const mealRef = doc(db, 'meal_selections', `${userId}_${dateStr}`);
  const docSnap = await getDoc(mealRef);
  
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
};

// Subscribe to meal selection for real-time updates
export const subscribeToMealSelection = (userId, date, callback) => {
  const dateStr = getDateString(date);
  const mealRef = doc(db, 'meal_selections', `${userId}_${dateStr}`);
  
  return onSnapshot(mealRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    } else {
      callback(null);
    }
  });
};

// Get all meal selections for a specific date (Admin)
export const getAllMealSelectionsForDate = async (date) => {
  const dateStr = getDateString(date);
  const q = query(collection(db, 'meal_selections'), where('date', '==', dateStr));
  const querySnapshot = await getDocs(q);
  
  const selections = [];
  querySnapshot.forEach((doc) => {
    selections.push(doc.data());
  });
  
  return selections;
};

// Get meal statistics for admin dashboard
export const getMealStatistics = async (date) => {
  const selections = await getAllMealSelectionsForDate(date);
  
  const stats = {
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    total: selections.length
  };
  
  selections.forEach((selection) => {
    if (selection.selections?.breakfast) stats.breakfast++;
    if (selection.selections?.lunch) stats.lunch++;
    if (selection.selections?.dinner) stats.dinner++;
  });
  
  return stats;
};

