import { db } from '../config/firebase';
import { collection, addDoc, query, orderBy, getDocs, onSnapshot, doc, updateDoc } from 'firebase/firestore';

// Submit feedback/suggestion
export const submitFeedback = async (userId, userEmail, feedback, type = 'suggestion') => {
  await addDoc(collection(db, 'feedback'), {
    userId,
    userEmail,
    feedback,
    type, // 'suggestion' or 'feedback'
    status: 'pending',
    createdAt: new Date().toISOString()
  });
};

// Submit complaint
export const submitComplaint = async (userId, userEmail, complaint, category = 'general') => {
  await addDoc(collection(db, 'complaints'), {
    userId,
    userEmail,
    complaint,
    category, // 'food_quality', 'service', 'timing', 'general'
    status: 'pending',
    createdAt: new Date().toISOString(),
    resolvedAt: null,
    adminResponse: null
  });
};

// Get all feedback (Admin)
export const getAllFeedback = async () => {
  const q = query(collection(db, 'feedback'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  const feedbacks = [];
  querySnapshot.forEach((doc) => {
    feedbacks.push({ id: doc.id, ...doc.data() });
  });
  
  return feedbacks;
};

// Subscribe to feedback for real-time updates (Admin)
export const subscribeToFeedback = (callback) => {
  const q = query(collection(db, 'feedback'), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (querySnapshot) => {
    const feedbacks = [];
    querySnapshot.forEach((doc) => {
      feedbacks.push({ id: doc.id, ...doc.data() });
    });
    callback(feedbacks);
  });
};

// Get all complaints (Admin)
export const getAllComplaints = async () => {
  const q = query(collection(db, 'complaints'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  const complaints = [];
  querySnapshot.forEach((doc) => {
    complaints.push({ id: doc.id, ...doc.data() });
  });
  
  return complaints;
};

// Subscribe to complaints for real-time updates (Admin)
export const subscribeToComplaints = (callback) => {
  const q = query(collection(db, 'complaints'), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (querySnapshot) => {
    const complaints = [];
    querySnapshot.forEach((doc) => {
      complaints.push({ id: doc.id, ...doc.data() });
    });
    callback(complaints);
  });
};

// Update complaint status (Admin)
export const updateComplaintStatus = async (complaintId, status, adminResponse = null) => {
  const complaintRef = doc(db, 'complaints', complaintId);
  const updateData = {
    status,
    updatedAt: new Date().toISOString()
  };
  
  if (status === 'resolved') {
    updateData.resolvedAt = new Date().toISOString();
  }
  
  if (adminResponse) {
    updateData.adminResponse = adminResponse;
  }
  
  await updateDoc(complaintRef, updateData);
};

// Get user's own feedback/complaints
export const getUserFeedback = async (userId) => {
  const feedbackQ = query(
    collection(db, 'feedback'),
    orderBy('createdAt', 'desc')
  );
  const complaintQ = query(
    collection(db, 'complaints'),
    orderBy('createdAt', 'desc')
  );
  
  const [feedbackSnapshot, complaintSnapshot] = await Promise.all([
    getDocs(feedbackQ),
    getDocs(complaintQ)
  ]);
  
  const userFeedback = [];
  const userComplaints = [];
  
  feedbackSnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.userId === userId) {
      userFeedback.push({ id: doc.id, ...data });
    }
  });
  
  complaintSnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.userId === userId) {
      userComplaints.push({ id: doc.id, ...data });
    }
  });
  
  return { feedback: userFeedback, complaints: userComplaints };
};

