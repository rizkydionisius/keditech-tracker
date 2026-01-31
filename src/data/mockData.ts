export interface Project {
  name: string;
  status: 'GREEN' | 'YELLOW' | 'RED';
  description: string;
}

export interface KPIMetric {
  label: string;
  value: number;
  previous_value: number;
}

export interface KPIHistoryItem {
  month: string;
  value: number;
}

export interface ReportData {
  projects: Project[];
  kpi?: KPIMetric;
  kpi_history?: KPIHistoryItem[];
}

export interface User {
  id: string;
  name: string;
  role: string;
  avatar: string;
  reports: Record<string, ReportData>; // Key format: "YYYY-MM"
}

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Kevin',
    role: 'CEO',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin',
    reports: {
      '2026-01': {
        kpi: {
          label: 'Monthly Revenue (Juta Rp)',
          value: 85,
          previous_value: 75
        },
        kpi_history: [
          { month: 'Nov', value: 65 },
          { month: 'Dec', value: 75 },
          { month: 'Jan', value: 85 }
        ],
        projects: [
          { 
            name: 'Strategy Anaxa', 
            status: 'GREEN',
            description: 'Completed the quarterly strategy review. All key stakeholders are aligned on the new direction for Q2. Currently focusing on partnership opportunities.'
          },
        ]
      },
      '2026-02': {
        kpi: {
          label: 'Monthly Revenue (Juta Rp)',
          value: 92,
          previous_value: 85
        },
        kpi_history: [
          { month: 'Dec', value: 75 },
          { month: 'Jan', value: 85 },
          { month: 'Feb', value: 92 }
        ],
        projects: [
          { 
            name: 'Review Q1', 
            status: 'YELLOW',
            description: 'Q1 review is slightly delayed due to pending data from the sales team. Expecting to finalize by mid-February.'
          },
        ]
      }
    }
  },
  {
    id: '2',
    name: 'Dion',
    role: 'CMO',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dion',
    reports: {
      '2026-01': {
        kpi: {
          label: 'Web Traffic',
          value: 5000,
          previous_value: 4200
        },
        kpi_history: [
            { month: 'Nov', value: 3000 },
            { month: 'Dec', value: 4200 },
            { month: 'Jan', value: 5000 }
        ],
        projects: [
          { 
            name: 'Project Anaxa', 
            status: 'GREEN',
            description: 'Successfully launched the initial marketing campaign. Engagement metrics are up by 15%.'
          },
          { 
            name: 'Marketing Plan', 
            status: 'YELLOW',
            description: 'Delayed due to pending budget approval for ad spend. Expecting resolution by Friday.'
          },
        ]
      },
      '2026-02': {
        kpi: {
          label: 'Web Traffic',
          value: 6500,
          previous_value: 5000
        },
         kpi_history: [
            { month: 'Dec', value: 4200 },
            { month: 'Jan', value: 5000 },
            { month: 'Feb', value: 6500 }
        ],
        projects: [
           { 
            name: 'Social Media Blitz', 
            status: 'GREEN',
            description: 'Social media campaign is live and performing well. Viral reach is above expectations.'
          },
        ]
      }
    }
  },
  {
    id: '3',
    name: 'Indri',
    role: 'BD',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Indri',
    reports: {
      '2026-01': {
        kpi: {
          label: 'New Deals Closed',
          value: 8,
          previous_value: 5 // Updated to reflect growth context if needed, but keeping 5->8 consistent
        },
        kpi_history: [
            { month: 'Nov', value: 2 },
            { month: 'Dec', value: 5 },
            { month: 'Jan', value: 8 }
        ],
        projects: [
          { 
            name: 'Client Acquisition', 
            status: 'GREEN', // Changed to GREEN for positive trend
            description: 'Successfully closed 2 major enterprise deals. Pipeline is looking very healthy for next month.'
          },
        ]
      },
      '2026-02': {
        projects: []
      }
    }
  },
  {
    id: '4',
    name: 'Iqbal',
    role: 'UI/UX',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Iqbal',
    reports: {
      '2026-01': {
        kpi: {
          label: 'Screens Designed',
          value: 25,
          previous_value: 18
        },
        kpi_history: [
            { month: 'Nov', value: 12 },
            { month: 'Dec', value: 18 },
            { month: 'Jan', value: 25 }
        ],
        projects: [
          { 
            name: 'Dashboard Redesign', 
            status: 'GREEN',
            description: 'Finalized the high-fidelity mockups for the new dashboard. Handed off assets to the engineering team.' 
          },
        ]
      }
    }
  },
  {
    id: '5',
    name: 'Syahrun',
    role: 'Graphic Design',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Syahrun',
    reports: {
      '2026-01': {
        kpi: {
          label: 'IG Followers',
          value: 1250,
          previous_value: 1200
        },
        kpi_history: [
            { month: 'Nov', value: 1000 },
            { month: 'Dec', value: 1200 },
            { month: 'Jan', value: 1250 }
        ],
        projects: [
          { 
            name: 'Social Media Assets', 
            status: 'GREEN',
            description: 'Delivered all requested assets for the upcoming social media blitz. Receiving positive feedback on the new visual style.' 
          },
        ]
      }
    }
  },
];
