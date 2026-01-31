import React from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import { User, Project } from '@/data/mockData';

// Reuse the type exports from UserCard for consistency, or defined locally.
// Since we are not exporting UserWithProjectsAndKPI from UserCard (it was not exported in previous step, checking...)
// Actually I exported it in previous step. Let's import it.
import { UserWithProjectsAndKPI } from '@/components/UserCard';

interface ReportDetailsModalProps {
  user: UserWithProjectsAndKPI | null;
  onClose: () => void;
}

export default function ReportDetailsModal({ user, onClose }: ReportDetailsModalProps) {
  if (!user) return null;

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'GREEN':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: <CheckCircle className="w-4 h-4 mr-1.5" />,
          label: 'On Track'
        };
      case 'YELLOW':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          icon: <AlertTriangle className="w-4 h-4 mr-1.5" />,
          label: 'At Risk'
        };
      case 'RED':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: <AlertCircle className="w-4 h-4 mr-1.5" />,
          label: 'Critical'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: null,
          label: 'Unknown'
        };
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 transform transition-all animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-4">
             <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
             </div>
             <div>
                <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
                <p className="text-sm font-medium text-slate-500">{user.role}</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="p-6 overflow-y-auto">
           <h3 className="text-sm uppercase tracking-wider text-slate-400 font-bold mb-6">Detailed Report</h3>
           <div className="space-y-6">
             {user.projects.map((project, index) => {
               const statusStyle = getStatusColor(project.status);
               return (
                 <div key={index} className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-bold text-slate-800">{project.name}</h4>
                        <div className={`flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusStyle.bg} ${statusStyle.text}`}>
                            {statusStyle.icon}
                            {statusStyle.label}
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-200 text-slate-600 text-sm leading-relaxed shadow-sm">
                        {project.description}
                    </div>
                 </div>
               );
             })}
           </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end flex-shrink-0">
            <button 
              onClick={onClose}
              className="px-5 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
            >
              Close
            </button>
        </div>
      </div>
    </div>
  );
}
