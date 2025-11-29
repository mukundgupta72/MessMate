import React from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Utensils, LayoutDashboard, MessageSquare, Bell, Settings, BarChart3 } from 'lucide-react';

export default function DashboardLayout() {
  const { logout, userRole, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const studentNavItems = [
    { path: '/student', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/student/feedback', label: 'Feedback & Complaints', icon: MessageSquare },
  ];

  const adminNavItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/announcements', label: 'Announcements', icon: Bell },
    { path: '/admin/feedback', label: 'Feedback & Complaints', icon: MessageSquare },
    { path: '/admin/stats', label: 'Statistics', icon: BarChart3 },
  ];

  const navItems = userRole === 'student' ? studentNavItems : adminNavItems;

  return (
    <div className="flex h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-orange-600 to-orange-700 text-white p-6 hidden md:block transition-all shadow-lg">
        <div className="flex items-center gap-2 mb-8 text-2xl font-bold">
          <Utensils className="text-orange-200" />
          <span>MessMate</span>
        </div>
        
        <nav className="space-y-1 mb-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                      isActive
                        ? 'bg-white text-orange-600 shadow-md'
                        : 'text-orange-100 hover:bg-orange-500 hover:text-white'
                    }`
                  }
                >
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              );
            })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col">
        <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
            <div>
               <h2 className="text-xl font-semibold capitalize text-gray-800">Dashboard</h2>
               <p className="text-sm text-gray-600">Welcome back, {currentUser?.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition font-medium"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
        </header>
        <div className="p-6 flex-1 bg-transparent">
            <Outlet />
        </div>
      </main>
    </div>
  );
}
