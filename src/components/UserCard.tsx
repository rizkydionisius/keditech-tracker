import React from 'react';
import { MoreHorizontal, AlertCircle, CheckCircle, AlertTriangle, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { User, Project, KPIMetric } from '@/data/mockData';

export interface UserWithProjectsAndKPI extends User {
  projects: Project[];
  kpi?: KPIMetric;
}

interface UserCardProps {
  user: UserWithProjectsAndKPI;
  onViewDetails?: (user: UserWithProjectsAndKPI) => void;
}

export default function UserCard({ user, onViewDetails }: UserCardProps) {
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'GREEN':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: <CheckCircle className="w-3.5 h-3.5 mr-1" />,
          label: 'On Track',
          order: 3
        };
      case 'YELLOW':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          icon: <AlertTriangle className="w-3.5 h-3.5 mr-1" />,
          label: 'At Risk',
          order: 2
        };
      case 'RED':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: <AlertCircle className="w-3.5 h-3.5 mr-1" />,
          label: 'Critical',
          order: 1
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: null,
          label: 'Unknown',
          order: 4
        };
    }
  };

  // Sort projects: Critical (RED) first, then At Risk (YELLOW), then On Track (GREEN)
  const sortedProjects = [...user.projects].sort((a, b) => {
    const scoreA = getStatusColor(a.status).order;
    const scoreB = getStatusColor(b.status).order;
    return scoreA - scoreB;
  });

  // Display only top 3
  const displayedProjects = sortedProjects.slice(0, 3);
  const remainingCount = sortedProjects.length - 3;

  return (
    <div className="bg-white shadow-md rounded-xl border border-gray-300 p-6 flex flex-col h-full hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-100 flex-shrink-0 shadow-sm">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 tracking-tight">{user.name}</h3>
            <p className="text-sm text-gray-500 font-medium">{user.role}</p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs uppercase tracking-wider text-slate-500 font-bold">Active Projects</h4>
          {remainingCount > 0 && (
             <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
               +{remainingCount} more projects...
             </span>
          )}
        </div>
        <div className="space-y-3">
          {displayedProjects.map((project, index) => {
            const statusStyle = getStatusColor(project.status);
            return (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 group hover:bg-slate-100 hover:border-slate-200 transition-colors"
                title={project.name}
              >
                <span className="text-sm font-semibold text-slate-700 truncate mr-2 flex-1">{project.name}</span>
                <div className={`flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${statusStyle.bg} ${statusStyle.text} whitespace-nowrap shadow-sm flex-shrink-0`}>
                  {statusStyle.icon}
                  {statusStyle.label}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Placeholder for empty state if no projects (optional, good practice) */}
        {displayedProjects.length === 0 && (
            <div className="text-center py-4 text-slate-400 text-sm italic">
                No active projects
            </div>
        )}
      </div>
      
       {/* Footer - Secondary Action Button */}
       <div className="mt-5 pt-2">
         <button 
           onClick={() => onViewDetails?.(user)}
           className="w-full py-2.5 font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors text-sm border border-indigo-100 flex items-center justify-center active:scale-[0.98] transform"
          >
            View Details
          </button>
       </div>
    </div>
  );
}
