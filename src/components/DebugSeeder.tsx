'use client';

import React, { useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { mockUsers } from '@/data/mockData';

export default function DebugSeeder() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleSeed = async () => {
    if (!confirm('Are you sure you want to seed the database? This might create duplicate data if run multiple times.')) return;
    
    setLoading(true);
    setStatus('Starting seed...');
    console.log('Starting seed...');

    try {
        for (const user of mockUsers) {
            setStatus(`Seeding user: ${user.name}...`);
            
            // 1. Insert User (Upsert)
            const { data: userData, error: userError } = await supabase
                .from('team_members')
                .upsert({
                    id: user.id || undefined, // Use existing ID if possible, or let Supabase gen one if uuid format matches? 
                    // mockData IDs are simple strings "1", "2". UUIDs are expected by Supabase typically.
                    // If schema expects UUID, "1" will fail.
                    // Let's rely on name matching or just create new. 
                    // To avoid duplicates, we can try to select first.
                    // IMPORTANT: DB schema requests UUID. mockData has "1". 
                    // We will NOT pass "id" from mockData to allow auto-gen UUID, 
                    // BUT we need to map the new UUID to the mockData user for relationships.
                    name: user.name,
                    role: user.role,
                    avatar_url: user.avatar
                }, { onConflict: 'name' }) // Assuming name is unique for this mock
                .select()
                .single();

            // If upsert by name isn't configured in DB (unique constraint), this might just insert.
            // Let's actually Look up by name first to be safe, or just Insert. 
            // For now, let's just Insert and assume empty DB or ignore error?
            // "Upsert" requires a unique constraint. 
            // Better approach for "DebugSeeder": Just perform inserts, assuming fresh DB.
            
            // Re-strategy: Select first.
            let userId: string;
            const { data: existingUser } = await supabase.from('team_members').select('id').eq('name', user.name).single();
            
            if (existingUser) {
                userId = existingUser.id;
            } else {
                 const { data: newUser, error: createError } = await supabase
                .from('team_members')
                .insert({
                    name: user.name,
                    role: user.role,
                    avatar_url: user.avatar
                })
                .select()
                .single();
                
                if (createError) throw createError;
                userId = newUser.id;
            }

            // Keep track of seeded months to avoid duplicates from history + reports
            const seededMonths = new Set<string>();

            // 2. Loop through Reports (2026-01, 2026-02)
            for (const [monthKey, report] of Object.entries(user.reports)) {
                
                // Insert KPIs from Report
                if (report.kpi) {
                    await supabase.from('monthly_kpis').insert({
                        user_id: userId,
                        month_key: monthKey,
                        kpi_label: report.kpi.label,
                        kpi_value: report.kpi.value,
                        kpi_previous_value: report.kpi.previous_value
                    });
                    seededMonths.add(monthKey);
                }

                // Insert Projects from Report
                if (report.projects && report.projects.length > 0) {
                     const projectsPayload = report.projects.map(p => ({
                        user_id: userId,
                        month_key: monthKey,
                        project_name: p.name,
                        status: p.status,
                        description: p.description
                    }));
                    await supabase.from('projects').insert(projectsPayload);
                }
            }

            // 3. Loop through KPI History (Shim for previous months like Nov, Dec)
            // We'll take the history from the first report available
            const firstReport = Object.values(user.reports)[0];
            if (firstReport && firstReport.kpi_history) {
                const kpiLabel = firstReport.kpi?.label || 'Metric';

                for (let i = 0; i < firstReport.kpi_history.length; i++) {
                    const item = firstReport.kpi_history[i];
                    // Map Month Name to YYYY-MM
                    // Assuming History is Nov 2025, Dec 2025, Jan 2026
                    const monthMap: Record<string, string> = {
                        'Nov': '2025-11',
                        'Dec': '2025-12',
                        'Jan': '2026-01',
                        'Feb': '2026-02'
                    };
                    const mKey = monthMap[item.month] || `2025-${item.month}`; // Fallback

                    if (!seededMonths.has(mKey)) {
                        // Infer previous value from the item before it, or 0
                        const prevVal = i > 0 ? firstReport.kpi_history[i-1].value : 0;
                        
                        await supabase.from('monthly_kpis').insert({
                            user_id: userId,
                            month_key: mKey,
                            kpi_label: kpiLabel,
                            kpi_value: item.value,
                            kpi_previous_value: prevVal
                        });
                        console.log(`Seeded history for ${user.name}: ${mKey}`);
                        seededMonths.add(mKey);
                    }
                }
            }

        }
        
        setStatus('Seeding complete!');
        alert('Success! Database populated.');
    } catch (e: any) {
        console.error(e);
        setStatus('Error: ' + e.message);
        alert('Error seeding database: ' + e.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100]">
      <button 
        onClick={handleSeed}
        disabled={loading}
        className="bg-slate-900 text-white px-4 py-2 rounded-lg shadow-xl text-xs font-mono border border-slate-700 hover:bg-slate-800 transition-colors"
      >
        {loading ? 'Seeding...' : '🌱 Upload Mock Data to DB'}
      </button>
      {status && (
          <div className="absolute bottom-full right-0 mb-2 bg-black/80 text-white text-[10px] p-2 rounded whitespace-nowrap">
              {status}
          </div>
      )}
    </div>
  );
}
