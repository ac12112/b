// types.ts
export interface ReportData {
    reportId: string;
    status: string;
    type: "EMERGENCY" | "NON_EMERGENCY";
    specificType: string;
    title: string;
    description: string;
    location: string;
    latitude: number | null;
    longitude: number | null;
    image: string | null;
    analysis?: {
      priority?: string;
      department?: string;
    };
    timeline?: Array<{
      description: string;
      timestamp: string | number;
    }>;
  }