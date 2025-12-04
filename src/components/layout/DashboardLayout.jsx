import React, { useState } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Utensils, LayoutDashboard, MessageSquare, Bell, BarChart3, Menu, X } from 'lucide-react';

export default function DashboardLayout() {
  const { logout, userRole, currentUser } = useAuth();
  const navigate = useNavigate();
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <div className="flex h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 overflow-hidden">
      
      {/* -------------------- MOBILE MENU OVERLAY -------------------- */}
      {/* Black transparent background when menu is open */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* -------------------- MOBILE SIDEBAR -------------------- */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-orange-600 to-orange-700 text-white p-6 transform transition-transform duration-300 ease-in-out md:hidden shadow-2xl ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2 text-2xl font-bold">
              <Utensils className="text-orange-200" />
              <span>MessMate</span>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="p-1 rounded-full hover:bg-orange-500/20 text-white transition"
            >
                <X size={24} />
            </button>
        </div>
        
        <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-lg transition font-medium ${
                      isActive
                        ? 'bg-white text-orange-600 shadow-md'
                        : 'text-orange-100 hover:bg-orange-500/50 hover:text-white'
                    }`
                  }
                >
                  <Icon size={20} />
                  {item.label}
                </NavLink>
              );
            })}
        </nav>

        {/* Mobile Logout */}
        <div className="absolute bottom-8 left-6 right-6">
            <button 
                onClick={handleLogout} 
                className="flex w-full items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-white px-4 py-3 rounded-lg transition font-medium border border-red-500/30"
            >
                <LogOut size={20} /> Logout
            </button>
        </div>
      </div>

      {/* -------------------- DESKTOP SIDEBAR -------------------- */}
      <aside className="w-64 bg-gradient-to-b from-orange-600 to-orange-700 text-white p-6 hidden md:block transition-all shadow-lg z-10">
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

      {/* -------------------- MAIN CONTENT -------------------- */}
      <main className="flex-1 overflow-auto flex flex-col relative w-full">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 px-4 sm:px-6 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
            
            <div className="flex items-center gap-3">
               {/* Hamburger Button (Visible only on Mobile) */}
               <button 
                 onClick={() => setIsMobileMenuOpen(true)} 
                 className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition"
               >
                  <Menu size={24} />
               </button>

               <div>
                  <h2 className="text-lg sm:text-xl font-semibold capitalize text-gray-800">Dashboard</h2>
                  <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Welcome back, {currentUser?.email}</p>
               </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={handleLogout} 
                className="hidden md:flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition font-medium"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
        </header>
        
        {/* Page Content */}
        <div className="p-4 sm:p-6 flex-1 bg-transparent">
            <Outlet />
        </div>
      </main>
    </div>
  );
}