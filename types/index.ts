export type EmployeeStatus = 'Active' | 'On Leave' | 'Probation' | 'Inactive';
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract';

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: EmployeeStatus;
  type: EmploymentType;
  salary: number;
  joined: string;
  location: string;
  manager: string;
  avatarBg: string;
  bio?: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  head: string;
  headRole: string;
  budget: number;
  color: string;
}

export type AttendanceStatus = 'Present' | 'Late' | 'Absent' | 'Remote' | 'On Leave' | 'Not Marked';
export type WorkMode = 'In-Office' | 'Remote';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeRole: string;
  department: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: AttendanceStatus;
  workMode: WorkMode;
}

export type LeaveType = 'Annual Vacation' | 'Sick Leave' | 'Casual Leave' | 'Emergency' | 'Maternity / Paternity';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  status: LeaveStatus;
  reason: string;
  appliedAt: string;
}

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  type: 'employee' | 'attendance' | 'leave' | 'department';
}

export interface AppData {
  employees: Employee[];
  departments: Department[];
  attendance: AttendanceRecord[];
  leaves: LeaveRequest[];
  activities: ActivityItem[];
}

