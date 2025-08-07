export interface MilestoneData {
  label: string;
  description: string;
  status: 'completed' | 'in-progress' | 'planned' | 'future';
  quarter: string;
  assignee?: string;
  dueDate?: string;
  progress?: number;
}

export interface QuarterGroup {
  id: string;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}
