'use client';

import React from 'react';
import {
  LayoutDashboard,
  Users,
  Clock,
  Building2,
  CalendarDays,
  Settings,
  Sparkles,
  RotateCcw,
  X,
  Shield,
  Layers,
} from 'lucide-react';

export type NavItem = 'overview' | 'employees' | 'attendance' | 'departments' | 'leaves' | 'settings';

interface SidebarProps {
  currentTab: NavItem;
  onSelectTab: (tab: NavItem) => void;
  counts: {
    employees: number;
    present: number;
    departments: number;
    pendingLeaves: number;
  };
  onResetData: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  currentTab,
  onSelectTab,
  counts,
  onResetData,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const navLinks = [
    {
      id: 'overview' as NavItem,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'employees' as NavItem,
      label: 'Employees',
      icon: Users,
      badge: counts.employees,
    },
    {
      id: 'attendance' as NavItem,
      label: 'Attendance',
      icon: Clock,
      badge: `${counts.present} in`,
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    },
    {
      id: 'departments' as NavItem,
      label: 'Departments',
      icon: Building2,
      badge: counts.departments,
    },
    {
      id: 'leaves' as NavItem,
      label: 'Time Off & Leaves',
      icon: CalendarDays,
      badge: counts.pendingLeaves > 0 ? `${counts.pendingLeaves} pending` : null,
      badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200/60 font-semibold',
    },
    {
      id: 'settings' as NavItem,
      label: 'Company Settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200/80 bg-white transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
              <Layers className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900">People</span>
                <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-sm font-extrabold text-indigo-600">
                  OS
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-400">Enterprise HR Suite</span>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Workspace Pill */}
        <div className="px-5 pt-5 pb-2">
          <div className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-slate-50/80 px-3.5 py-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-100 font-bold text-xs text-indigo-700">
                AC
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-800">Acme Technologies</p>
                <p className="text-[10px] text-slate-400">Headquarters · 12 Staff</p>
              </div>
            </div>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Workspace Navigation
          </div>
          {navLinks.map((item) => {
            const isActive = currentTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-200'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span
                    className={`ml-2 rounded-md px-2 py-0.5 text-xs font-semibold ${
                      isActive
                        ? 'bg-indigo-700 text-indigo-100'
                        : item.badgeColor || 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Reset Database Promo Card */}
        <div className="p-4">
          <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-50 to-indigo-50/40 p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <span>Dummy Database</span>
            </div>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              All changes persist in browser storage. Test adding, editing or deleting records freely.
            </p>
            <button
              onClick={onResetData}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:text-indigo-600 transition"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Demo Database
            </button>
          </div>
        </div>

        {/* Admin Footer */}
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-white">
                AD
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Admin Manager</p>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                  <Shield className="h-3 w-3" />
                  Full Privileges
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
