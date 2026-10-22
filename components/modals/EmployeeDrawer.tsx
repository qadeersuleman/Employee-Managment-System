'use client';

import React from 'react';
import {
  X,
  Pencil,
  Trash2,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { Employee, AttendanceRecord } from '@/types';
import { formatMoney, formatDate, getInitials } from '@/lib/storage';

interface EmployeeDrawerProps {
  employee: Employee | null;
  attendanceRecord?: AttendanceRecord;
  onClose: () => void;
  onEdit: (emp: Employee) => void;
  onDelete: (emp: Employee) => void;
}

export function EmployeeDrawer({
  employee,
  attendanceRecord,
  onClose,
  onEdit,
  onDelete,
}: EmployeeDrawerProps) {
  if (!employee) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/40 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        className="h-full w-full max-w-lg bg-white shadow-2xl overflow-y-auto flex flex-col border-l border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Employee Dossier
          </span>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-start gap-4">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-black text-slate-800 shadow-sm"
              style={{ backgroundColor: employee.avatarBg }}
            >
              {getInitials(employee.name)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900 truncate">{employee.name}</h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    employee.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700'
                      : employee.status === 'On Leave'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-indigo-50 text-indigo-700'
                  }`}
                >
                  {employee.status}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 mt-0.5">{employee.role}</p>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-slate-600 font-mono text-[11px]">
                  {employee.id}
                </span>
                <span className="text-slate-400">·</span>
                <span className="font-semibold text-indigo-600">{employee.department}</span>
              </div>
            </div>
          </div>

          {employee.bio && (
            <p className="mt-4 text-xs text-slate-600 leading-relaxed italic border-t border-slate-200/60 pt-3">
              &quot;{employee.bio}&quot;
            </p>
          )}
        </div>

        {/* Details sections */}
        <div className="p-6 space-y-6 flex-1">
          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Contact Information
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
                <Mail className="h-4 w-4 text-indigo-500 shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-slate-400 font-medium">Work Email</span>
                  <p className="font-semibold text-slate-800 truncate">{employee.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
                <Phone className="h-4 w-4 text-emerald-500 shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-slate-400 font-medium">Phone</span>
                  <p className="font-semibold text-slate-800">{employee.phone || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
                <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-slate-400 font-medium">Workplace Location</span>
                  <p className="font-semibold text-slate-800">{employee.location || 'Remote'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Job & Compensation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Job & Compensation
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-slate-100 p-3">
                <span className="text-[10px] text-slate-400 font-medium">Contract Type</span>
                <p className="font-bold text-slate-800 mt-0.5">{employee.type}</p>
              </div>

              <div className="rounded-xl border border-slate-100 p-3">
                <span className="text-[10px] text-slate-400 font-medium">Reporting Manager</span>
                <p className="font-bold text-slate-800 mt-0.5">{employee.manager}</p>
              </div>

              <div className="rounded-xl border border-slate-100 p-3">
                <span className="text-[10px] text-slate-400 font-medium">Annual Salary</span>
                <p className="font-bold text-slate-900 mt-0.5">{formatMoney(employee.salary)}</p>
              </div>

              <div className="rounded-xl border border-slate-100 p-3">
                <span className="text-[10px] text-slate-400 font-medium">Monthly Equivalent</span>
                <p className="font-bold text-slate-900 mt-0.5">{formatMoney(employee.salary / 12)}</p>
              </div>

              <div className="rounded-xl border border-slate-100 p-3 col-span-2">
                <span className="text-[10px] text-slate-400 font-medium">Joined Organization</span>
                <p className="font-bold text-slate-800 mt-0.5">{formatDate(employee.joined)}</p>
              </div>
            </div>
          </div>

          {/* Today's Attendance Snapshot */}
          {attendanceRecord && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Today&apos;s Attendance Record
              </h4>
              <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 text-xs">
                <div>
                  <div className="font-bold text-slate-800">
                    Status: <span className="text-indigo-600">{attendanceRecord.status}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {attendanceRecord.checkIn
                      ? `Clocked in at ${attendanceRecord.checkIn}`
                      : 'No check-in timestamp today'}
                  </p>
                </div>
                <span className="rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">
                  {attendanceRecord.workMode}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-100 p-6 flex items-center justify-between gap-3 bg-white">
          <button
            onClick={() => {
              onDelete(employee);
              onClose();
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
          >
            <Trash2 className="h-4 w-4" />
            Delete Record
          </button>

          <button
            onClick={() => {
              onEdit(employee);
              onClose();
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 transition"
          >
            <Pencil className="h-4 w-4" />
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
