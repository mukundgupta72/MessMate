import React from 'react';
import { AlertCircle, Info, AlertTriangle, Bell } from 'lucide-react';

const priorityConfig = {
  urgent: { icon: Bell, bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-800' },
  high: { icon: AlertTriangle, bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-800' },
  normal: { icon: Info, bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-800' },
  low: { icon: AlertCircle, bg: 'bg-gray-50', border: 'border-gray-300', text: 'text-gray-800' }
};

export default function AnnouncementCard({ announcement }) {
  const config = priorityConfig[announcement.priority] || priorityConfig.normal;
  const Icon = config.icon;

  return (
    <div className={`${config.bg} ${config.border} border-l-4 p-4 rounded-lg mb-4`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${config.text} mt-0.5 flex-shrink-0`} />
        <div className="flex-1">
          <h3 className={`font-semibold ${config.text} mb-1`}>{announcement.title}</h3>
          <p className="text-gray-700 text-sm">{announcement.message}</p>
          {announcement.createdAt && (
            <p className="text-xs text-gray-500 mt-2">
              {new Date(announcement.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

