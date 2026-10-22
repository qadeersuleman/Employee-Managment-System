'use client';

import React, { useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  AlertCircle,
} from 'lucide-react';
import { LeaveRequest, LeaveStatus } from '@/types';
import { formatDate, getInitials } from '@/lib/storage';

interface LeavesViewProps {
  leaves: LeaveRequest[];
  onApproveLeave: (id: string) => void;
  onRejectLeave: (id: string) => void;
  onOpenLeaveModal: () => void;
}

export function LeavesView({
  leaves,
  onApproveLeave,
  onRejectLeave,
  onOpenLeaveModal,
}: LeavesViewProps) {
  const [statusFilter, setStatusFilter] = useState<'All' | LeaveStatus>('All');
  const [search, setSearch] = useState('');

  const filteredLeaves = leaves.filter((leave) => {
    const q = search.toLowerCase();
    const matchesSearch =
      leave.employeeName.toLowerCase().includes(q) ||
      leave.department.toLowerCase().includes(q) ||
      leave.type.toLowerCase().includes(q) ||
      leave.reason.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'All' || leave.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = leaves.filter((l) => l.status === 'Pending').length;
  const approvedCount = leaves.filter((l) => l.status === 'Approved').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-amber-200/70 bg-amber-50/40 p-5">
          <div className="flex items-center justify-between text-xs font-bold text-amber-800">
            <span>Pending Approvals</span>
            <AlertCircle className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-900">{pendingCount}</div>
          <p className="mt-1 text-xs text-amber-700">Awaiting management action</p>
        </div>

        <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/40 p-5">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
            <span>Approved Requests</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-900">{approvedCount}</div>
          <p className="mt-1 text-xs text-emerald-700">Scheduled time-off</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Total Logged</span>
            <CalendarDays className="h-4 w-4 text-slate-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{leaves.length}</div>
          <p className="mt-1 text-xs text-slate-400">Total company PTO entries</p>
        </div>
      </div>

      {/* Action and Filter Bar */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by employee name or reason..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenLeaveModal}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Submit Leave Request</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="font-semibold text-slate-500">Filter Status:</span>
          {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-lg px-3 py-1 font-semibold transition ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">Employee</th>
                <th className="px-4 py-4">Department</th>
                <th className="px-4 py-4">Leave Type</th>
                <th className="px-4 py-4">Duration & Dates</th>
                <th className="px-4 py-4">Reason</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-6 py-4 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeaves.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/70 transition">
                  {/* Employee */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 font-bold text-xs text-indigo-700">
                        {getInitials(req.employeeName)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{req.employeeName}</div>
                        <div className="text-xs text-slate-400">ID: {req.employeeId}</div>
                      </div>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="px-4 py-4">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {req.department}
                    </span>
                  </td>

                  {/* Type */}
                  <td className="px-4 py-4 font-semibold text-slate-800 text-xs">
                    {req.type}
                  </td>

                  {/* Duration */}
                  <td className="px-4 py-4 text-xs text-slate-600">
                    <div className="font-bold text-slate-800">
                      {req.days} {req.days === 1 ? 'day' : 'days'}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {formatDate(req.startDate)} → {formatDate(req.endDate)}
                    </div>
                  </td>

                  {/* Reason */}
                  <td className="px-4 py-4 text-xs text-slate-500 max-w-[220px]">
                    <span className="line-clamp-2 italic">&quot;{req.reason}&quot;</span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                        req.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700'
                          : req.status === 'Rejected'
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {req.status}
                    </span>
                  </td>

                  {/* Action buttons */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {req.status === 'Pending' ? (
                        <>
                          <button
                            onClick={() => onApproveLeave(req.id)}
                            className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
                            title="Approve request"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Approve
                          </button>
                          <button
                            onClick={() => onRejectLeave(req.id)}
                            className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
                            title="Reject request"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Reject
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                          {req.status === 'Approved' ? (
                            <span className="text-emerald-600">✓ Approved</span>
                          ) : (
                            <span className="text-rose-600">✕ Rejected</span>
                          )}
                          <button
                            onClick={() => (req.status === 'Approved' ? onRejectLeave(req.id) : onApproveLeave(req.id))}
                            className="ml-2 rounded-md border border-slate-200 px-2 py-0.5 text-[10px] text-slate-500 hover:bg-slate-50"
                            title="Toggle status"
                          >
                            Change
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
