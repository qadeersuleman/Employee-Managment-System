'use client';

import React from 'react';
import {
  Building2,
  ArrowRight,
} from 'lucide-react';
import { Department, Employee } from '@/types';
import { formatMoney, getInitials } from '@/lib/storage';

interface DepartmentsViewProps {
  departments: Department[];
  employees: Employee[];
  onSelectDepartment: (deptName: string) => void;
}

export function DepartmentsView({
  departments,
  employees,
  onSelectDepartment,
}: DepartmentsViewProps) {
  const totalBudget = departments.reduce((acc, d) => acc + d.budget, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Active Divisions</span>
          <div className="mt-2 text-2xl font-black text-slate-900">{departments.length}</div>
          <p className="mt-1 text-xs text-slate-400">All functional company units</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Allocated Budget</span>
          <div className="mt-2 text-2xl font-black text-slate-900">{formatMoney(totalBudget)}</div>
          <p className="mt-1 text-xs text-slate-400">Fiscal year departmental allocation</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Average Team Size</span>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {departments.length ? Math.round(employees.length / departments.length) : 0} members
          </div>
          <p className="mt-1 text-xs text-slate-400">Balanced distribution</p>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {departments.map((dept) => {
          const members = employees.filter((e) => e.department === dept.name);
          const deptPayroll = members.reduce((acc, m) => acc + m.salary, 0);

          return (
            <div
              key={dept.id}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:border-indigo-300 hover:shadow-md transition"
            >
              <div>
                {/* Header with color indicator */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-xl font-bold text-white shadow-2xs"
                      style={{ backgroundColor: dept.color }}
                    >
                      <Building2 className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition">
                        {dept.name}
                      </h3>
                      <span className="text-xs text-slate-400 font-medium">
                        {members.length} {members.length === 1 ? 'member' : 'members'}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-xs text-slate-500 leading-relaxed min-h-[40px]">
                  {dept.description}
                </p>

                {/* Division Lead */}
                <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Division Lead
                  </span>
                  <div className="mt-1.5 flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 font-bold text-xs text-indigo-700">
                      {getInitials(dept.head)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{dept.head}</p>
                      <p className="text-[11px] text-slate-500">{dept.headRole}</p>
                    </div>
                  </div>
                </div>

                {/* Financials & Team Roster Preview */}
                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Budget</span>
                    <p className="font-bold text-slate-800">{formatMoney(dept.budget)}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Team Payroll</span>
                    <p className="font-bold text-slate-800">{formatMoney(deptPayroll)}</p>
                  </div>
                </div>

                {/* Team member avatars */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="flex -space-x-2 overflow-hidden">
                    {members.slice(0, 4).map((m) => (
                      <div
                        key={m.id}
                        title={m.name}
                        className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[10px] font-extrabold text-slate-700 shadow-2xs"
                        style={{ backgroundColor: m.avatarBg }}
                      >
                        {getInitials(m.name)}
                      </div>
                    ))}
                    {members.length > 4 && (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-[10px] font-bold text-slate-600">
                        +{members.length - 4}
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {members.length} Assigned
                  </span>
                </div>
              </div>

              {/* View Members Button */}
              <button
                onClick={() => onSelectDepartment(dept.name)}
                className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 transition"
              >
                <span>View Department Staff</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
