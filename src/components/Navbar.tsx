'use client';

import React from 'react';
import Image from 'next/image';
import { Plus, LogOut } from 'lucide-react';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface NavbarProps {
    month: string;
    onMonthChange: (m: string) => void;
    onOpenUpdateModal: () => void;
}

export default function Navbar({ month, onMonthChange, onOpenUpdateModal }: NavbarProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <div className="relative h-10 w-40">
                <Image 
                  src="/logo.png" 
                  alt="Keditech Logo" 
                  fill
                  className="object-contain object-left"
                  priority
                />
             </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Month Filter Picker */}
            <div className="hidden md:block">
               <input 
                 type="month"
                 value={month}
                 onChange={(e) => {
                    if (e.target.value) onMonthChange(e.target.value);
                 }}
                 className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-sm font-medium rounded-full px-4 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm transition-all"
               />
            </div>

            <button 
              onClick={onOpenUpdateModal}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Update Progress</span>
              <span className="sm:hidden">Update</span>
            </button>

             <button 
               onClick={handleSignOut}
               className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
               title="Sign Out"
             >
                <LogOut className="w-5 h-5" />
             </button>
          </div>
        </div>
      </header>
  );
}
