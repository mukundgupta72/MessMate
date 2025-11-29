import { db } from '../config/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

// Get today's menu (Real-time)
export const subscribeToMenu = (callback, onError) => {
  return onSnapshot(
    doc(db, "mess", "daily_menu"), 
    (doc) => {
      if (doc.exists()) {
        callback(doc.data());
      } else {
        // Document doesn't exist yet - call with empty data
        callback({ breakfast: '', lunch: '', dinner: '' });
      }
    },
    (error) => {
      console.error('Menu subscription error:', error);
      if (onError) onError(error);
      // Call callback with empty data on error
      callback({ breakfast: '', lunch: '', dinner: '' });
    }
  );
};

// Update menu (Admin only)
export const updateDailyMenu = async (menuData) => {
  const menuRef = doc(db, "mess", "daily_menu");
  await setDoc(menuRef, menuData, { merge: true });
};