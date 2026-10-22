'use client';

import React, { useState, useEffect } from 'react';
import { AppData, Employee, AttendanceRecord, AttendanceStatus, WorkMode, LeaveRequest } from '@/types';
import { initialData } from '@/lib/dummyData';
import { loadAppData, saveAppData, resetAppData } from '@/lib/storage';

import { Sidebar, NavItem } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { OverviewView } from '@/components/views/OverviewView';
import { EmployeesView } from '@/components/views/EmployeesView';
import { AttendanceView } from '@/components/views/AttendanceView';
import { DepartmentsView } from '@/components/views/DepartmentsView';
import { LeavesView } from '@/components/views/LeavesView';
import { SettingsView } from '@/components/views/SettingsView';

import { EmployeeModal } from '@/components/modals/EmployeeModal';
import { EmployeeDrawer } from '@/components/modals/EmployeeDrawer';
import { LeaveModal } from '@/components/modals/LeaveModal';
import { Toast } from '@/components/Toast';

export default function Home() {
  const [data, setData] = useState<AppData>(initialData);
  const [isClientReady, setIsClientReady] = useState(false);
  const [currentTab, setCurrentTab] = useState<NavItem>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState('All');

  // Modals & Drawers state
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Load from localStorage on client mount
  useEffect(() => {
    const loaded = loadAppData();
    setData(loaded);
    setIsClientReady(true);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (isClientReady) {
      saveAppData(data);
    }
  }, [data, isClientReady]);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Handlers: Employees
  const handleSaveEmployee = (emp: Employee) => {
    setData((prev) => {
      const exists = prev.employees.some((e) => e.id === emp.id);
      let updatedEmployees: Employee[];
      let updatedAttendance = [...prev.attendance];

      if (exists) {
        updatedEmployees = prev.employees.map((e) => (e.id === emp.id ? emp : e));
        // Update attendance name/role if changed
        updatedAttendance = updatedAttendance.map((a) =>
          a.employeeId === emp.id
            ? { ...a, employeeName: emp.name, employeeRole: emp.role, department: emp.department }
            : a
        );
      } else {
        updatedEmployees = [emp, ...prev.employees];
        // Add attendance record for new employee
        const newAtt: AttendanceRecord = {
          id: `att-${Date.now()}`,
          employeeId: emp.id,
          employeeName: emp.name,
          employeeRole: emp.role,
          department: emp.department,
          date: new Date().toISOString().slice(0, 10),
          checkIn: '09:00 AM',
          checkOut: null,
          status: 'Present',
          workMode: 'In-Office',
        };
        updatedAttendance.push(newAtt);
      }

      const newActivity = {
        id: `act-${Date.now()}`,
        user: 'Admin Manager',
        action: exists ? 'updated profile details for' : 'added new employee',
        target: `${emp.name} (${emp.role})`,
        time: 'Just now',
        type: 'employee' as const,
      };

      return {
        ...prev,
        employees: updatedEmployees,
        attendance: updatedAttendance,
        activities: [newActivity, ...prev.activities],
      };
    });

    setToast(editingEmployee ? 'Employee updated successfully' : 'Employee added to database');
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = (emp: Employee) => {
    if (window.confirm(`Are you sure you want to remove ${emp.name} from the database?`)) {
      setData((prev) => ({
        ...prev,
        employees: prev.employees.filter((e) => e.id !== emp.id),
        attendance: prev.attendance.filter((a) => a.employeeId !== emp.id),
        activities: [
          {
            id: `act-${Date.now()}`,
            user: 'Admin Manager',
            action: 'deleted employee record',
            target: emp.name,
            time: 'Just now',
            type: 'employee',
          },
          ...prev.activities,
        ],
      }));
      setToast(`${emp.name} was removed from the database`);
    }
  };

  // Handlers: Attendance
  const handleUpdateAttendanceStatus = (
    id: string,
    newStatus: AttendanceStatus,
    mode?: WorkMode
  ) => {
    setData((prev) => {
      let targetName = '';
      const updatedAttendance = prev.attendance.map((rec) => {
        if (rec.id === id) {
          targetName = rec.employeeName;
          return {
            ...rec,
            status: newStatus,
            workMode: mode || rec.workMode,
            checkIn: newStatus === 'Absent' ? null : rec.checkIn || '09:00 AM',
          };
        }
        return rec;
      });

      return {
        ...prev,
        attendance: updatedAttendance,
        activities: [
          {
            id: `act-${Date.now()}`,
            user: 'Admin Manager',
            action: `marked status as ${newStatus} for`,
            target: targetName || 'Employee',
            time: 'Just now',
            type: 'attendance',
          },
          ...prev.activities,
        ],
      };
    });
    setToast(`Attendance updated to ${newStatus}`);
  };

  const handleMarkAllPresent = () => {
    setData((prev) => ({
      ...prev,
      attendance: prev.attendance.map((a) => ({
        ...a,
        status: 'Present',
        checkIn: a.checkIn || '09:00 AM',
        workMode: 'In-Office',
      })),
      activities: [
        {
          id: `act-${Date.now()}`,
          user: 'Admin Manager',
          action: 'bulk verified presence for',
          target: 'All staff',
          time: 'Just now',
          type: 'attendance',
        },
        ...prev.activities,
      ],
    }));
    setToast('All unrecorded employees marked as Present');
  };

  // Handlers: Leaves
  const handleApproveLeave = (leaveId: string) => {
    setData((prev) => {
      let reqEmployee = '';
      const updatedLeaves = prev.leaves.map((l) => {
        if (l.id === leaveId) {
          reqEmployee = l.employeeName;
          return { ...l, status: 'Approved' as const };
        }
        return l;
      });

      return {
        ...prev,
        leaves: updatedLeaves,
        activities: [
          {
            id: `act-${Date.now()}`,
            user: 'Admin Manager',
            action: 'approved time-off request for',
            target: reqEmployee,
            time: 'Just now',
            type: 'leave',
          },
          ...prev.activities,
        ],
      };
    });
    setToast('Leave request approved');
  };

  const handleRejectLeave = (leaveId: string) => {
    setData((prev) => {
      let reqEmployee = '';
      const updatedLeaves = prev.leaves.map((l) => {
        if (l.id === leaveId) {
          reqEmployee = l.employeeName;
          return { ...l, status: 'Rejected' as const };
        }
        return l;
      });

      return {
        ...prev,
        leaves: updatedLeaves,
        activities: [
          {
            id: `act-${Date.now()}`,
            user: 'Admin Manager',
            action: 'rejected time-off request for',
            target: reqEmployee,
            time: 'Just now',
            type: 'leave',
          },
          ...prev.activities,
        ],
      };
    });
    setToast('Leave request rejected');
  };

  const handleSubmitLeave = (newLeave: LeaveRequest) => {
    setData((prev) => ({
      ...prev,
      leaves: [newLeave, ...prev.leaves],
      activities: [
        {
          id: `act-${Date.now()}`,
          user: newLeave.employeeName,
          action: 'submitted time-off request for',
          target: `${newLeave.type} (${newLeave.days} days)`,
          time: 'Just now',
          type: 'leave',
        },
        ...prev.activities,
      ],
    }));
    setToast('Leave request submitted successfully');
  };

  // Handlers: Reset & Exports
  const handleResetData = () => {
    if (window.confirm('Reset all changes and reload the fresh demo dummy database?')) {
      const fresh = resetAppData();
      setData(fresh);
      setToast('Dummy database restored to initial sample state');
    }
  };

  const handleExportCsv = () => {
    const headers = [
      'ID',
      'Name',
      'Email',
      'Phone',
      'Role',
      'Department',
      'Status',
      'Contract Type',
      'Salary (USD)',
      'Joined Date',
      'Location',
    ];
    const rows = data.employees.map((e) => [
      e.id,
      `"${e.name.replace(/"/g, '""')}"`,
      e.email,
      e.phone,
      `"${e.role.replace(/"/g, '""')}"`,
      `"${e.department.replace(/"/g, '""')}"`,
      e.status,
      e.type,
      e.salary,
      e.joined,
      `"${e.location.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'peopleos-employees.csv';
    link.click();
    URL.revokeObjectURL(url);
    setToast('Employee CSV exported');
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'peopleos-database-backup.json';
    link.click();
    URL.revokeObjectURL(url);
    setToast('Database backup downloaded as JSON');
  };

  // Calculated counts for navigation badges
  const sidebarCounts = {
    employees: data.employees.length,
    present: data.attendance.filter((a) => a.status === 'Present' || a.status === 'Remote').length,
    departments: data.departments.length,
    pendingLeaves: data.leaves.filter((l) => l.status === 'Pending').length,
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] antialiased">
      {/* Collapsible Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        counts={sidebarCounts}
        onResetData={handleResetData}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Sticky Top Header */}
        <Header
          currentTab={currentTab}
          onOpenMobile={() => setMobileMenuOpen(true)}
          onOpenAddEmployee={() => {
            setEditingEmployee(null);
            setIsEmployeeModalOpen(true);
          }}
          activities={data.activities}
        />

        {/* View Container */}
        <main className="flex-1 px-5 py-6 sm:px-8 sm:py-8 max-w-7xl w-full mx-auto">
          {currentTab === 'overview' && (
            <OverviewView
              data={data}
              onNavigate={setCurrentTab}
              onApproveLeave={handleApproveLeave}
              onRejectLeave={handleRejectLeave}
              onOpenAddEmployee={() => {
                setEditingEmployee(null);
                setIsEmployeeModalOpen(true);
              }}
            />
          )}

          {currentTab === 'employees' && (
            <EmployeesView
              employees={data.employees}
              departments={data.departments}
              initialDepartmentFilter={selectedDepartmentFilter}
              onOpenAddModal={() => {
                setEditingEmployee(null);
                setIsEmployeeModalOpen(true);
              }}
              onOpenEditModal={(emp) => {
                setEditingEmployee(emp);
                setIsEmployeeModalOpen(true);
              }}
              onOpenViewDrawer={(emp) => setViewingEmployee(emp)}
              onDeleteEmployee={handleDeleteEmployee}
              onExportCsv={handleExportCsv}
            />
          )}

          {currentTab === 'attendance' && (
            <AttendanceView
              attendance={data.attendance}
              departments={data.departments}
              onUpdateAttendanceStatus={handleUpdateAttendanceStatus}
              onMarkAllPresent={handleMarkAllPresent}
            />
          )}

          {currentTab === 'departments' && (
            <DepartmentsView
              departments={data.departments}
              employees={data.employees}
              onSelectDepartment={(deptName) => {
                setSelectedDepartmentFilter(deptName);
                setCurrentTab('employees');
              }}
            />
          )}

          {currentTab === 'leaves' && (
            <LeavesView
              leaves={data.leaves}
              onApproveLeave={handleApproveLeave}
              onRejectLeave={handleRejectLeave}
              onOpenLeaveModal={() => setIsLeaveModalOpen(true)}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              data={data}
              onResetData={handleResetData}
              onExportJson={handleExportJson}
            />
          )}
        </main>
      </div>

      {/* Add / Edit Employee Modal */}
      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => {
          setIsEmployeeModalOpen(false);
          setEditingEmployee(null);
        }}
        onSave={handleSaveEmployee}
        departments={data.departments}
        editingEmployee={editingEmployee}
      />

      {/* Employee Detail Drawer */}
      <EmployeeDrawer
        employee={viewingEmployee}
        attendanceRecord={data.attendance.find((a) => a.employeeId === viewingEmployee?.id)}
        onClose={() => setViewingEmployee(null)}
        onEdit={(emp) => {
          setViewingEmployee(null);
          setEditingEmployee(emp);
          setIsEmployeeModalOpen(true);
        }}
        onDelete={(emp) => {
          setViewingEmployee(null);
          handleDeleteEmployee(emp);
        }}
      />

      {/* Submit Leave Request Modal */}
      <LeaveModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        employees={data.employees}
        onSubmit={handleSubmitLeave}
      />

      {/* Toast Feedback Notification */}
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
