'use client';

import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Legend, LineChart, Line
} from 'recharts';
import { Sparkles, Loader2, TrendingUp } from 'lucide-react';
import { User, mockUsers } from '@/data/mockData';

interface AnalyticsTabProps {
  currentMonth: string;
  users: User[];
}

export default function AnalyticsTab({ currentMonth, users }: AnalyticsTabProps) {
  const [aiSummary, setAiSummary] = useState("");
  const [isAnalysing, setIsAnalysing] = useState(false);

  // Manual Trigger
  const handleGenerateSummary = async () => {
    if (users.length === 0) {
        alert("No data available to analyze yet.");
        return;
    }

    setIsAnalysing(true);
    setAiSummary(""); // Clear previous if any

    try {
        // Prepare lightweight data payload for AI
        const payload = users.map(u => ({
            name: u.name,
            role: u.role,
            kpi: u.reports[currentMonth]?.kpi,
            active_projects: u.reports[currentMonth]?.projects?.length
        }));

        const res = await fetch('/api/ai-summary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: payload })
        });
        const json = await res.json();
        setAiSummary(json.summary);
    } catch (e) {
        console.error(e);
        setAiSummary("Could not generate insight at this time.");
    } finally {
        setIsAnalysing(false);
    }
  };

  // Find users with history
  const kevin = users.find(u => u.name === 'Kevin');
  const dion = users.find(u => u.name === 'Dion');
  const indri = users.find(u => u.name === 'Indri');
  const iqbal = users.find(u => u.name === 'Iqbal');
  const syahrun = users.find(u => u.name === 'Syahrun');

  // Helper to extract data for current month (or default)
  const getHistory = (user: User | undefined) => {
    if (!user) return [];
    const report = user.reports[currentMonth];
    return report?.kpi_history || [];
  };

  const revenueData = getHistory(kevin);
  const trafficData = getHistory(dion);
  const dealsData = getHistory(indri);
  const screensData = getHistory(iqbal);
  const socialData = getHistory(syahrun);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. AI Summary Card */}
      <div className="bg-gradient-to-r from-green-50 to-indigo-50 p-6 rounded-2xl border border-green-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
           <TrendingUp className="w-24 h-24 text-green-500" />
        </div>
        <div className="relative z-10 w-full">
          <h3 className="text-sm font-bold uppercase tracking-wider text-green-700 mb-4 flex items-center">
             <span className="mr-2 text-lg">🚀</span> AI Monthly Insight
          </h3>
          
          {/* 1. Initial State: Button */}
          {!aiSummary && !isAnalysing && (
             <div className="flex flex-col items-center justify-center p-6 text-center">
                <p className="text-slate-500 mb-4">
                    Analyze team performance, revenue trends, and KPIs instantly with Gemini AI.
                </p>
                <button 
                  onClick={handleGenerateSummary}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center transform hover:scale-105 active:scale-95"
                >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate AI Insight
                </button>
             </div>
          )}

          {/* 2. Loading State */}
          {isAnalysing && (
             <div className="flex flex-col items-center justify-center p-8 text-center text-indigo-600">
                <Loader2 className="w-10 h-10 animate-spin mb-3" />
                <p className="font-semibold animate-pulse">Analyzing team performance...</p>
             </div>
          )}

          {/* 3. Result State */}
          {aiSummary && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                 <p className="text-slate-700 text-lg font-medium leading-relaxed max-w-4xl whitespace-pre-line">
                    {aiSummary}
                 </p>
                 <button 
                   onClick={() => setAiSummary('')}
                   className="mt-4 text-xs font-semibold text-slate-400 hover:text-indigo-600 underline"
                 >
                    Regenerate
                 </button>
              </div>
          )}
        </div>
      </div>

      {/* 2. Main Chart (Kevin's Revenue) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
         <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Revenue Trend (Kevin)</h3>
              <p className="text-sm text-slate-500">Monthly Revenue in Juta Rp</p>
            </div>
            <div className="text-2xl font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg">
               +13% <span className="text-xs text-green-700 font-medium ml-1">vs last month</span>
            </div>
         </div>
         <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{ stroke: '#4f46e5', strokeWidth: 2 }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue (Juta)" />
               </AreaChart>
            </ResponsiveContainer>
         </div>
      </div>

      {/* 3. Secondary Charts Grid (2x2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         
         {/* Syahrun (Followers) - Bar Chart */}
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="mb-4">
              <h3 className="text-base font-bold text-slate-800">IG Followers (Syahrun)</h3>
              <p className="text-xs text-slate-500">Consistent organic growth</p>
            </div>
            <div className="h-[200px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={socialData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                     <RechartsTooltip contentStyle={{ borderRadius: '8px' }} cursor={{fill: '#F1F5F9'}} />
                     <Bar dataKey="value" fill="#ec4899" radius={[4, 4, 0, 0]} name="Followers" barSize={40} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Indri (Deals) - Line Chart (Green for Growth) */}
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="absolute top-4 right-4">
               <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="mb-4">
              <h3 className="text-base font-bold text-slate-800">Deals Closed (Indri)</h3>
              <p className="text-xs text-green-600 font-medium">Strong recovery & growth</p>
            </div>
            <div className="h-[200px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dealsData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                     <RechartsTooltip contentStyle={{ borderRadius: '8px' }} />
                     <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981'}} name="Deals" />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Dion (Traffic) - Area Chart */}
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="mb-4">
              <h3 className="text-base font-bold text-slate-800">Web Traffic (Dion)</h3>
              <p className="text-xs text-slate-500">Aggressive growth trajectory</p>
            </div>
            <div className="h-[200px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trafficData}>
                     <defs>
                        <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                     <RechartsTooltip contentStyle={{ borderRadius: '8px' }} />
                     <Area type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={3} fill="url(#colorTraffic)" name="Visitors" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

          {/* Iqbal (Screens) - Bar Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="mb-4">
              <h3 className="text-base font-bold text-slate-800">Screens Designed (Iqbal)</h3>
              <p className="text-xs text-slate-500">High productivity output</p>
            </div>
            <div className="h-[200px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={screensData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                     <RechartsTooltip contentStyle={{ borderRadius: '8px' }} cursor={{fill: '#F1F5F9'}} />
                     <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Screens" barSize={40} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

      </div>
    </div>
  );
}
