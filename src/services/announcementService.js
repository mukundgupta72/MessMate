import { db } from '../config/firebase';
import { collection, addDoc, query, orderBy, getDocs, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';

// Create announcement (Admin)
export const createAnnouncement = async (title, message, priority = 'normal') => {
  await addDoc(collection(db, 'announcements'), {
    title,
    message,
    priority, // 'low', 'normal', 'high', 'urgent'
    isActive: true,
    createdAt: new Date().toISOString(),
    createdBy: 'admin'
  });
};

// Get all active announcements
export const getActiveAnnouncements = async () => {
  const q = query(
    collection(db, 'announcements'),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  
  const announcements = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.isActive) {
      announcements.push({ id: doc.id, ...data });
    }
  });
  
  return announcements;
};

// Subscribe to active announcements for real-time updates
export const subscribeToAnnouncements = (callback, onError) => {
  const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
  
  return onSnapshot(
    q,
    (querySnapshot) => {
      const announcements = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.isActive) {
          announcements.push({ id: doc.id, ...data });
        }
      });
      callback(announcements);
    },
    (error) => {
      console.error('Announcements subscription error:', error);
      if (onError) onError(error);
      // Call callback with empty array on error
      callback([]);
    }
  );
};

// Get all announcements including inactive (Admin)
export const getAllAnnouncements = async () => {
  const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  const announcements = [];
  querySnapshot.forEach((doc) => {
    announcements.push({ id: doc.id, ...doc.data() });
  });
  
  return announcements;
};

// Toggle announcement active status (Admin)
export const toggleAnnouncement = async (announcementId, isActive) => {
  const announcementRef = doc(db, 'announcements', announcementId);
  await updateDoc(announcementRef, {
    isActive,
    updatedAt: new Date().toISOString()
  });
};

// Delete announcement (Admin)
export const deleteAnnouncement = async (announcementId) => {
  await deleteDoc(doc(db, 'announcements', announcementId));
};

