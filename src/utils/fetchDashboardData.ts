import { supabase } from './supabase/client';
import { User, ReportData } from '@/data/mockData';

export const getDashboardData = async (): Promise<User[]> => {
  try {
    // 1. Fetch Team Members
    const { data: members, error: membersError } = await supabase
      .from('team_members')
      .select('*');

    if (membersError) throw membersError;
    if (!members) return [];

    // 2. Fetch All Projects (In a real app, you might filter this, but for now we fetch all to match mapped structure)
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*');
      
    if (projectsError) throw projectsError;

    // 3. Fetch All KPIs
    const { data: kpis, error: kpisError } = await supabase
      .from('monthly_kpis')
      .select('*')
      .order('month_key', { ascending: true }); // Order ensures history is built correctly if we inferred it, though we have explicit prev_value

    if (kpisError) throw kpisError;

    // 4. Map to User Structure
    const users: User[] = members.map(member => {
      const memberReports: Record<string, ReportData> = {};

      // A. Populate Projects per Month
      const memberProjects = projects?.filter(p => p.user_id === member.id) || [];
      memberProjects.forEach(p => {
        if (!memberReports[p.month_key]) {
            memberReports[p.month_key] = { projects: [], kpi: undefined, kpi_history: undefined };
        }
        memberReports[p.month_key].projects.push({
            name: p.project_name,
            status: p.status as 'GREEN' | 'YELLOW' | 'RED',
            description: p.description
        });
      });

      // B. Populate KPIs per Month
      const memberKpis = kpis?.filter(k => k.user_id === member.id) || [];
      
      // We need to build the full history array for each month entry to support the Analytics charts
      // The charts expect "kpi_history" to be an array of { month: 'Nov', value: 100 } etc.
      // We can derive this from the full list of KPIs for this user.
      
      // Sort KPIs by date implicitly (month_key usually YYYY-MM)
      // They are already ordered by query, but let's be safe
      memberKpis.sort((a, b) => a.month_key.localeCompare(b.month_key));

      memberKpis.forEach(k => {
        if (!memberReports[k.month_key]) {
             memberReports[k.month_key] = { projects: [], kpi: undefined, kpi_history: undefined };
        }
        
        // Set main KPI
        memberReports[k.month_key].kpi = {
            label: k.kpi_label,
            value: k.kpi_value,
            previous_value: k.kpi_previous_value
        };

        // Build History Array (Past 3-4 months relative to this month, or just all available?)
        // The mockData had explicit subsets. Let's just give all available history up to this point?
        // Or simpler: Give ALL history available for the user. Charts handle X-axis.
        const history = memberKpis.map(mk => {
            // Convert YYYY-MM to Short Month Name (e.g. "Jan", "Feb")
            const date = new Date(`${mk.month_key}-01`);
            const monthName = date.toLocaleString('default', { month: 'short' });
            return {
                month: monthName,
                value: mk.kpi_value
            };
        });
        
        memberReports[k.month_key].kpi_history = history;
      });

      return {
        id: member.id,
        name: member.name,
        role: member.role,
        avatar: member.avatar_url,
        reports: memberReports
      };
    });

    return users;

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return [];
  }
};
