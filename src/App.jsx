import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import DashboardLayout from './components/layout/DashboardLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import FeedbackComplaints from './pages/student/FeedbackComplaints';
import AnnouncementsManage from './pages/admin/AnnouncementsManage';
import FeedbackManage from './pages/admin/FeedbackManage';
import Statistics from './pages/admin/Statistics';
import ErrorBoundary from './components/ErrorBoundary';

// Protected Route Component
const PrivateRoute = ({ children, allowedRoles }) => {
  const { currentUser, userRole } = useAuth();
  
  if (!currentUser) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(userRole)) return <Navigate to="/" />;
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ErrorBoundary>
          <Toaster 
            position="top-right"
          />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes inside Layout */}
            <Route element={<DashboardLayout />}>
              
              {/* Student Routes */}
              <Route path="/student" element={
                <PrivateRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </PrivateRoute>
              } />
              
              <Route path="/student/feedback" element={
                <PrivateRoute allowedRoles={['student']}>
                  <FeedbackComplaints />
                </PrivateRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </PrivateRoute>
              } />

              <Route path="/admin/announcements" element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AnnouncementsManage />
                </PrivateRoute>
              } />

              <Route path="/admin/feedback" element={
                <PrivateRoute allowedRoles={['admin']}>
                  <FeedbackManage />
                </PrivateRoute>
              } />

              <Route path="/admin/stats" element={
                <PrivateRoute allowedRoles={['admin']}>
                  <Statistics />
                </PrivateRoute>
              } />

            </Route>

            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </ErrorBoundary>
      </Router>
    </AuthProvider>
  );
}

export default App;
