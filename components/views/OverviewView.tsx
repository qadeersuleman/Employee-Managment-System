'use client';

import React from 'react';
import {
  Users,
  Clock,
  Wallet,
  CalendarDays,
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { AppData } from '@/types';
import { formatMoney, getInitials, formatDate } from '@/lib/storage';
import { NavItem } from '../Sidebar';

interface OverviewViewProps {
  data: AppData;
  onNavigate: (tab: NavItem) => void;
  onApproveLeave: (leaveId: string) => void;
  onRejectLeave: (leaveId: string) => void;
  onOpenAddEmployee: () => void;
}

export function OverviewView({
  data,
  onNavigate,
  onApproveLeave,
  onRejectLeave,
  onOpenAddEmployee,
}: OverviewViewProps) {
  const { employees, departments, attendance, leaves, activities } = data;

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === 'Active').length;
  const onLeaveEmployees = employees.filter((e) => e.status === 'On Leave').length;

  const presentCount = attendance.filter((a) => a.status === 'Present').length;
  const remoteCount = attendance.filter((a) => a.status === 'Remote').length;
  const absentCount = attendance.filter((a) => a.status === 'Absent').length;
  const attendanceRate = totalEmployees ? Math.round(((presentCount + remoteCount) / totalEmployees) * 100) : 0;

  const totalAnnualPayroll = employees.reduce((acc, curr) => acc + curr.salary, 0);
  const monthlyPayroll = totalAnnualPayroll / 12;

  const pendingLeaves = leaves.filter((l) => l.status === 'Pending');

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl shadow-slate-900/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-200 border border-white/15">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
              Human Resources Management Suite
            </div>
            <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl text-white">
              Welcome back, Admin 👋
            </h2>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Your company has <strong className="text-white">{totalEmployees} total team members</strong> across{' '}
              <strong className="text-white">{departments.length} departments</strong>. Today’s active turnout is{' '}
              <strong className="text-emerald-400">{attendanceRate}%</strong> with {pendingLeaves.length} leave requests awaiting review.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('employees')}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-900 shadow-sm hover:bg-slate-100 transition"
            >
              <Users className="h-4 w-4 text-indigo-600" />
              View Employees
            </button>
            <button
              onClick={onOpenAddEmployee}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 transition"
            >
              + Add Member
            </button>
          </div>
        </div>
      </div>

      {/* 4 Clean Metric KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Staff */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:border-indigo-200 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Personnel</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-slate-900">{totalEmployees}</span>
            <span className="text-xs font-medium text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> {activeEmployees} active
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {onLeaveEmployees} on leave · 0 probation
          </p>
        </div>

        {/* Turnout / Attendance */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:border-emerald-200 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Today’s Attendance</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-slate-900">{attendanceRate}%</span>
            <span className="text-xs font-medium text-slate-500">
              ({presentCount + remoteCount} / {totalEmployees})
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {presentCount} office · {remoteCount} remote · {absentCount} absent
          </p>
        </div>

        {/* Payroll */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:border-violet-200 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Estimated Monthly Payroll</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-slate-900">
              {formatMoney(monthlyPayroll)}
            </span>
            <span className="text-xs font-medium text-slate-400">/ mo</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {formatMoney(totalAnnualPayroll)} annual run-rate
          </p>
        </div>

        {/* Pending Requests */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:border-amber-200 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Time-off Requests</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <CalendarDays className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-slate-900">
              {pendingLeaves.length}
            </span>
            <span className="text-xs font-semibold text-amber-600">Action required</span>
          </div>
          <button
            onClick={() => onNavigate('leaves')}
            className="mt-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            Review requests <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Main Grid: Pending Approvals & Today's Attendance Snapshot */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Presence Quick Snapshot */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Today’s Staff Status</h3>
              <p className="text-xs text-slate-400">Live attendance distribution across company</p>
            </div>
            <button
              onClick={() => onNavigate('attendance')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              Open Register <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5 text-center">
              <div className="text-xs font-bold text-emerald-800">In Office</div>
              <div className="mt-1 text-xl font-black text-emerald-700">{presentCount}</div>
              <div className="text-[10px] text-emerald-600 mt-0.5">Checked in</div>
            </div>
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3.5 text-center">
              <div className="text-xs font-bold text-blue-800">Remote</div>
              <div className="mt-1 text-xl font-black text-blue-700">{remoteCount}</div>
              <div className="text-[10px] text-blue-600 mt-0.5">Online</div>
            </div>
            <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3.5 text-center">
              <div className="text-xs font-bold text-amber-800">On Leave</div>
              <div className="mt-1 text-xl font-black text-amber-700">{onLeaveEmployees}</div>
              <div className="text-[10px] text-amber-600 mt-0.5">Approved</div>
            </div>
            <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-3.5 text-center">
              <div className="text-xs font-bold text-rose-800">Absent</div>
              <div className="mt-1 text-xl font-black text-rose-700">{absentCount}</div>
              <div className="text-[10px] text-rose-600 mt-0.5">Unexcused</div>
            </div>
          </div>

          {/* Quick List of Checked in today */}
          <div className="mt-5 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Recent Check-ins
            </div>
            {attendance
              .filter((a) => a.checkIn)
              .slice(0, 4)
              .map((rec) => (
                <div
                  key={rec.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 px-3.5 py-2.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-700">
                      {getInitials(rec.employeeName)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{rec.employeeName}</p>
                      <p className="text-[11px] text-slate-400">{rec.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 rounded-md bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-600 border border-slate-200">
                      <Clock className="h-3 w-3 text-emerald-600" />
                      {rec.checkIn}
                    </span>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        rec.workMode === 'Remote'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {rec.workMode}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Pending Leave Requests requiring Attention */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Pending Leave Approvals</h3>
                {pendingLeaves.length > 0 && (
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200/60">
                    {pendingLeaves.length} pending
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">Review time-off requests directly from here</p>
            </div>
            <button
              onClick={() => onNavigate('leaves')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              All Leaves <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {pendingLeaves.length === 0 ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" />
                <p className="mt-2 text-xs font-semibold text-slate-700">All caught up!</p>
                <p className="text-xs text-slate-400">No pending leave requests at this time.</p>
              </div>
            ) : (
              pendingLeaves.map((leave) => (
                <div
                  key={leave.id}
                  className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs hover:border-slate-300 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {leave.employeeName}
                        </span>
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                          {leave.department}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-indigo-700 font-medium">
                        {leave.type} · {leave.days} {leave.days === 1 ? 'day' : 'days'}
                      </p>
                      <p className="mt-1 text-xs text-slate-500 italic">
                        &quot;{leave.reason}&quot;
                      </p>
                      <p className="mt-2 text-[10px] text-slate-400">
                        Dates: {formatDate(leave.startDate)} → {formatDate(leave.endDate)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => onApproveLeave(leave.id)}
                        className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
                        title="Approve leave request"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Approve
                      </button>
                      <button
                        onClick={() => onRejectLeave(leave.id)}
                        className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
                        title="Reject leave request"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Secondary Row: Department Headcount Breakdown & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Department Distribution */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Department Headcount</h3>
              <p className="text-xs text-slate-400">Team distribution and budget utilization</p>
            </div>
            <button
              onClick={() => onNavigate('departments')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              Departments Hub <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {departments.map((dept) => {
              const count = employees.filter((e) => e.department === dept.name).length;
              const pct = totalEmployees ? Math.round((count / totalEmployees) * 100) : 0;
              return (
                <div key={dept.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: dept.color }}
                      />
                      <span className="font-bold text-slate-800">{dept.name}</span>
                    </div>
                    <span className="font-semibold text-slate-600">
                      {count} {count === 1 ? 'member' : 'members'} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${pct}%`, backgroundColor: dept.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Audit & Activity Log</h3>
              <p className="text-xs text-slate-400">Recent administrative operations and status changes</p>
            </div>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
              Auto-tracked
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {activities.slice(0, 5).map((act) => (
              <div
                key={act.id}
                className="flex items-start gap-3 rounded-xl border border-slate-100 p-3 hover:bg-slate-50/50 transition"
              >
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50 font-bold text-xs text-indigo-700">
                  {act.user.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-800">
                    <strong className="text-slate-900 font-bold">{act.user}</strong>{' '}
                    <span className="text-slate-600">{act.action}</span>
                  </p>
                  <p className="text-[11px] font-medium text-indigo-600 truncate">{act.target}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
