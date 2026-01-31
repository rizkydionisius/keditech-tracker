'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Plus, LayoutGrid, BarChart2, Loader2 } from 'lucide-react';
import UserCard, { UserWithProjectsAndKPI } from '@/components/UserCard';
import { User } from '@/data/mockData';
import UpdateProgressModal from '@/components/UpdateProgressModal';
import ReportDetailsModal from '@/components/ReportDetailsModal';
import AnalyticsTab from '@/components/AnalyticsTab';
import { getDashboardData } from '@/utils/fetchDashboardData';

import Navbar from '@/components/Navbar';

export default function Dashboard() {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithProjectsAndKPI | null>(null);
  const [selectedMonth, setSelectedMonth] = useState("2026-01");
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics'>('overview');
  
  // Real Data State
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Logic
  useEffect(() => {
    async function loadData() {
        setLoading(true);
        const fetchedUsers = await getDashboardData();
        setData(fetchedUsers);
        setLoading(false);
    }
    loadData();
  }, []);

  const handleCloseReportModal = () => {
    setSelectedUser(null);
  };

  // Filter users based on selectMonth
  const filteredUsers = useMemo(() => {
    return data.map(user => {
      // Get report for the selected month, or default to empty
      const report = user.reports[selectedMonth];
      const monthlyProjects = report?.projects || [];
      const monthlyKPI = report?.kpi;
      
      // Return a new user object with filtered projects AND KPI data
      return {
        ...user,
        projects: monthlyProjects,
        kpi: monthlyKPI
      };
    });
  }, [data, selectedMonth]); // Depend on 'data' now implies re-calc when fetch completes

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Modals */}
      <UpdateProgressModal 
        isOpen={isUpdateModalOpen} 
        onClose={() => setIsUpdateModalOpen(false)} 
        initialMonth={selectedMonth}
      />
      
      <ReportDetailsModal 
        user={selectedUser} 
        onClose={handleCloseReportModal} 
      />

      {/* Navbar with Logout */}
      <Navbar 
        month={selectedMonth} 
        onMonthChange={setSelectedMonth} 
        onOpenUpdateModal={() => setIsUpdateModalOpen(true)} 
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Team Performance</h2>
            <p className="text-slate-500 mt-2 text-lg">
                Monitor monthly progress and blockages across all departments for <span className="font-semibold text-slate-700">{selectedMonth}</span>.
            </p>
          </div>
          
          {/* Tab Switcher */}
          <div className="flex p-1 bg-slate-200/50 rounded-xl">
             <button
               onClick={() => setActiveTab('overview')}
               className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
                <LayoutGrid className="w-4 h-4" />
                <span>Overview</span>
             </button>
             <button
               onClick={() => setActiveTab('analytics')}
               className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'analytics' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
                <BarChart2 className="w-4 h-4" />
                <span>Analytics</span>
             </button>
          </div>
        </div>

        {/* Loading State or Content */}
        {loading ? (
             <div className="flex flex-col items-center justify-center py-20 text-slate-400 animate-pulse">
                <Loader2 className="w-10 h-10 mb-4 animate-spin text-indigo-500" />
                <p className="text-sm font-medium">Syncing with Keditech Database...</p>
             </div>
        ) : (
            <>
                {activeTab === 'overview' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10 animate-in fade-in zoom-in-95 duration-300">
                    {filteredUsers.map((user) => (
                        <UserCard 
                        key={user.id} 
                        user={user} 
                        onViewDetails={(u) => setSelectedUser(u)}
                        />
                    ))}
                    {!loading && filteredUsers.length === 0 && (
                        <div className="col-span-full text-center py-12 text-slate-400">
                            No data found for this month.
                        </div>
                    )}
                    </div>
                ) : (
                    <AnalyticsTab currentMonth={selectedMonth} users={data} />
                )}
            </>
        )}

      </main>
    </div>
  );
}
