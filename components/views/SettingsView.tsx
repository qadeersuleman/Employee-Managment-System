'use client';

import React from 'react';
import {
  Database,
  RotateCcw,
  Download,
  Building,
  Clock,
} from 'lucide-react';
import { AppData } from '@/types';

interface SettingsViewProps {
  data: AppData;
  onResetData: () => void;
  onExportJson: () => void;
}

export function SettingsView({ data, onResetData, onExportJson }: SettingsViewProps) {
  return (
    <div className="max-w-4xl space-y-6 pb-12">
      {/* Company Profile Settings */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Building className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Company Information</h3>
            <p className="text-xs text-slate-400">Enterprise workspace metadata and branding</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 text-xs">
          <div>
            <label className="font-bold text-slate-600">Company Name</label>
            <input
              type="text"
              readOnly
              value="Acme Technologies Inc."
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-medium text-slate-800 outline-none"
            />
          </div>
          <div>
            <label className="font-bold text-slate-600">Workspace Domain</label>
            <input
              type="text"
              readOnly
              value="acme.peopleos.internal"
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-medium text-slate-800 outline-none"
            />
          </div>
          <div>
            <label className="font-bold text-slate-600">Default Currency</label>
            <input
              type="text"
              readOnly
              value="USD ($)"
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-medium text-slate-800 outline-none"
            />
          </div>
          <div>
            <label className="font-bold text-slate-600">Office Timezone</label>
            <input
              type="text"
              readOnly
              value="America/New_York (UTC-5)"
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-medium text-slate-800 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Work Policy */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Attendance & Working Hours Policy</h3>
            <p className="text-xs text-slate-400">Rules governing check-in windows and remote work</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3 text-xs">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
            <div className="font-bold text-slate-700">Official Hours</div>
            <div className="mt-1 text-sm font-black text-slate-900">09:00 AM – 05:30 PM</div>
            <p className="text-[11px] text-slate-400 mt-1">40 hours / week</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
            <div className="font-bold text-slate-700">Grace Period</div>
            <div className="mt-1 text-sm font-black text-slate-900">15 Minutes</div>
            <p className="text-[11px] text-slate-400 mt-1">Flagged late after 09:15 AM</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
            <div className="font-bold text-slate-700">Annual Paid Leaves</div>
            <div className="mt-1 text-sm font-black text-slate-900">22 Days / Year</div>
            <p className="text-[11px] text-slate-400 mt-1">Vacation & emergency balance</p>
          </div>
        </div>
      </div>

      {/* Database Management & Reset */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Demo Database Controls</h3>
            <p className="text-xs text-slate-400">Manage client-side dummy database and state backups</p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div>
              <div className="text-xs font-bold text-slate-800">Export Full Database as JSON</div>
              <p className="text-[11px] text-slate-500">
                Download all {data.employees.length} employees, {data.departments.length} departments,{' '}
                {data.leaves.length} leave requests, and attendance logs.
              </p>
            </div>
            <button
              onClick={onExportJson}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 shadow-2xs transition"
            >
              <Download className="h-4 w-4" />
              Export JSON
            </button>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50/40 p-4">
            <div>
              <div className="text-xs font-bold text-rose-900">Reset Dummy Database</div>
              <p className="text-[11px] text-rose-700">
                Restores original sample data (12 employees, 6 departments, attendance records, leaves).
              </p>
            </div>
            <button
              onClick={onResetData}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 shadow-xs transition"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
