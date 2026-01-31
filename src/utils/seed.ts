import { supabase } from './supabase/client';
import { mockUsers } from '@/data/mockData';

export const seedDatabase = async () => {
  console.log('Starting seed...');

  for (const user of mockUsers) {
    // 1. Insert User
    const { data: userData, error: userError } = await supabase
      .from('team_members')
      .insert({
        name: user.name,
        role: user.role,
        avatar_url: user.avatar
      })
      .select()
      .single();

    if (userError) {
      console.error('Error seeding user:', user.name, userError);
      continue;
    }

    const userId = userData.id;

    // Iterate through reports (months)
    for (const [monthKey, report] of Object.entries(user.reports)) {
      
      // 2. Insert Projects
      if (report.projects && report.projects.length > 0) {
        const projectsPayload = report.projects.map(p => ({
            user_id: userId,
            month_key: monthKey,
            project_name: p.name,
            status: p.status,
            description: p.description
        }));
        
        const { error: projError } = await supabase
            .from('projects')
            .insert(projectsPayload);
            
        if (projError) console.error('Error seeding projects for', user.name, projError);
      }

      // 3. Insert KPI
      if (report.kpi) {
        const kpiPayload = {
            user_id: userId,
            month_key: monthKey,
            kpi_label: report.kpi.label,
            kpi_value: report.kpi.value,
            kpi_previous_value: report.kpi.previous_value,
            history_data: report.kpi_history // Storing the history array as JSONB for easy retrieval
        };

        const { error: kpiError } = await supabase
            .from('monthly_kpis')
            .insert(kpiPayload);
            
        if (kpiError) console.error('Error seeding KPI for', user.name, kpiError);
      }
    }
  }

  console.log('Seeding complete!');
};
