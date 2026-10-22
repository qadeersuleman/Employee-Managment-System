'use client';

import React, { useState, useMemo } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Laptop,
  Building2,
  CalendarDays,
  Search,
  Check,
} from 'lucide-react';
import { AttendanceRecord, AttendanceStatus, WorkMode, Department } from '@/types';
import { getInitials } from '@/lib/storage';

interface AttendanceViewProps {
  attendance: AttendanceRecord[];
  departments: Department[];
  onUpdateAttendanceStatus: (id: string, newStatus: AttendanceStatus, mode?: WorkMode) => void;
  onMarkAllPresent: () => void;
}

export function AttendanceView({
  attendance,
  departments,
  onUpdateAttendanceStatus,
  onMarkAllPresent,
}: AttendanceViewProps) {
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = useMemo(() => {
    return attendance.filter((item) => {
      const q = search.toLowerCase();
      const matchesSearch =
        item.employeeName.toLowerCase().includes(q) ||
        item.employeeRole.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q);

      const matchesDept = departmentFilter === 'All' || item.department === departmentFilter;
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [attendance, search, departmentFilter, statusFilter]);

  const presentCount = attendance.filter((a) => a.status === 'Present').length;
  const remoteCount = attendance.filter((a) => a.status === 'Remote').length;
  const lateCount = attendance.filter((a) => a.status === 'Late').length;
  const absentCount = attendance.filter((a) => a.status === 'Absent').length;
  const onLeaveCount = attendance.filter((a) => a.status === 'On Leave').length;
  const totalCount = attendance.length;
  const turnoutRate = totalCount ? Math.round(((presentCount + remoteCount + lateCount) / totalCount) * 100) : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Attendance Stats Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/40 p-4">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
            <span>In-Office Present</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-900">{presentCount}</div>
          <p className="text-[11px] text-emerald-700 mt-0.5">On premise today</p>
        </div>

        <div className="rounded-2xl border border-blue-200/70 bg-blue-50/40 p-4">
          <div className="flex items-center justify-between text-xs font-bold text-blue-800">
            <span>Working Remote</span>
            <Laptop className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-blue-900">{remoteCount}</div>
          <p className="text-[11px] text-blue-700 mt-0.5">Verified online</p>
        </div>

        <div className="rounded-2xl border border-amber-200/70 bg-amber-50/40 p-4">
          <div className="flex items-center justify-between text-xs font-bold text-amber-800">
            <span>Late Check-in</span>
            <AlertCircle className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-900">{lateCount}</div>
          <p className="text-[11px] text-amber-700 mt-0.5">After 09:00 AM</p>
        </div>

        <div className="rounded-2xl border border-rose-200/70 bg-rose-50/40 p-4">
          <div className="flex items-center justify-between text-xs font-bold text-rose-800">
            <span>Absent Today</span>
            <XCircle className="h-4 w-4 text-rose-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-rose-900">{absentCount}</div>
          <p className="text-[11px] text-rose-700 mt-0.5">No check-in record</p>
        </div>

        <div className="rounded-2xl border border-purple-200/70 bg-purple-50/40 p-4">
          <div className="flex items-center justify-between text-xs font-bold text-purple-800">
            <span>On Approved Leave</span>
            <CalendarDays className="h-4 w-4 text-purple-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-purple-900">{onLeaveCount}</div>
          <p className="text-[11px] text-purple-700 mt-0.5">PTO / Medical leave</p>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search attendance by employee name or role..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllPresent}
              className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/70 px-3.5 py-2.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition"
              title="Fast action: marks unrecorded staff as present"
            >
              <Check className="h-4 w-4" />
              <span>Mark All Unmarked as Present</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <span className="font-semibold text-slate-500">Filter by:</span>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 outline-none"
          >
            <option value="All">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Present">Present</option>
            <option value="Remote">Remote</option>
            <option value="Late">Late</option>
            <option value="Absent">Absent</option>
            <option value="On Leave">On Leave</option>
          </select>

          <span className="ml-auto text-slate-400 text-xs">
            Turnout Rate: <strong className="text-slate-800">{turnoutRate}%</strong>
          </span>
        </div>
      </div>

      {/* Attendance Register Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">Employee</th>
                <th className="px-4 py-4">Department</th>
                <th className="px-4 py-4">Check-in Time</th>
                <th className="px-4 py-4">Work Location</th>
                <th className="px-4 py-4">Current Status</th>
                <th className="px-6 py-4 text-right">Quick Change Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/70 transition">
                  {/* Employee */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 font-bold text-xs text-indigo-700">
                        {getInitials(record.employeeName)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{record.employeeName}</div>
                        <div className="text-xs text-slate-400">{record.employeeRole}</div>
                      </div>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="px-4 py-4">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {record.department}
                    </span>
                  </td>

                  {/* Check-in time */}
                  <td className="px-4 py-4 text-xs font-medium text-slate-600">
                    {record.checkIn ? (
                      <span className="inline-flex items-center gap-1.5 font-mono text-slate-800">
                        <Clock className="h-3.5 w-3.5 text-emerald-600" />
                        {record.checkIn}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Not recorded</span>
                    )}
                  </td>

                  {/* Work Mode */}
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${
                        record.workMode === 'Remote'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {record.workMode === 'Remote' ? (
                        <Laptop className="h-3 w-3" />
                      ) : (
                        <Building2 className="h-3 w-3" />
                      )}
                      {record.workMode}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                        record.status === 'Present'
                          ? 'bg-emerald-50 text-emerald-700'
                          : record.status === 'Remote'
                          ? 'bg-blue-50 text-blue-700'
                          : record.status === 'Late'
                          ? 'bg-amber-50 text-amber-700'
                          : record.status === 'Absent'
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-purple-50 text-purple-700'
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {record.status}
                    </span>
                  </td>

                  {/* Action buttons to toggle status directly */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onUpdateAttendanceStatus(record.id, 'Present', 'In-Office')}
                        className={`rounded-lg px-2 py-1 text-xs font-bold transition ${
                          record.status === 'Present'
                            ? 'bg-emerald-600 text-white'
                            : 'border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                        }`}
                        title="Mark Present in Office"
                      >
                        Present
                      </button>
                      <button
                        onClick={() => onUpdateAttendanceStatus(record.id, 'Remote', 'Remote')}
                        className={`rounded-lg px-2 py-1 text-xs font-bold transition ${
                          record.status === 'Remote'
                            ? 'bg-blue-600 text-white'
                            : 'border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                        }`}
                        title="Mark Remote"
                      >
                        Remote
                      </button>
                      <button
                        onClick={() => onUpdateAttendanceStatus(record.id, 'Absent')}
                        className={`rounded-lg px-2 py-1 text-xs font-bold transition ${
                          record.status === 'Absent'
                            ? 'bg-rose-600 text-white'
                            : 'border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                        }`}
                        title="Mark Absent"
                      >
                        Absent
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 px-6 py-3.5 text-xs text-slate-400 bg-slate-50/50 flex items-center justify-between">
          <span>
            Clicking <strong>Present</strong>, <strong>Remote</strong>, or <strong>Absent</strong> updates the employee&apos;s status instantly in your dummy database.
          </span>
          <span className="font-semibold text-slate-600">
            {filtered.length} of {attendance.length} listed
          </span>
        </div>
      </div>
    </div>
  );
}
