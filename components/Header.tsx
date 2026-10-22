'use client';

import React, { useEffect, useState } from 'react';
import {
  Menu,
  Plus,
  Bell,
  Calendar,
  X,
} from 'lucide-react';
import { NavItem } from './Sidebar';
import { ActivityItem } from '@/types';

interface HeaderProps {
  currentTab: NavItem;
  onOpenMobile: () => void;
  onOpenAddEmployee: () => void;
  activities: ActivityItem[];
}

export function Header({
  currentTab,
  onOpenMobile,
  onOpenAddEmployee,
  activities,
}: HeaderProps) {
  const [currentDate, setCurrentDate] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    setCurrentDate(
      new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    );
  }, []);

  const titles: Record<NavItem, { title: string; subtitle: string }> = {
    overview: {
      title: 'Company Dashboard',
      subtitle: 'Real-time overview of personnel, attendance, and team velocity',
    },
    employees: {
      title: 'Employee Directory',
      subtitle: 'Manage staff profiles, departmental assignments, and compensations',
    },
    attendance: {
      title: 'Daily Attendance Register',
      subtitle: 'Monitor clock-ins, remote statuses, and daily absences in real-time',
    },
    departments: {
      title: 'Department Directory',
      subtitle: 'Organizational structures, division leads, and allocated annual budgets',
    },
    leaves: {
      title: 'Leave & Time Off Requests',
      subtitle: 'Review, approve, or reject paid time off and medical absences',
    },
    settings: {
      title: 'Workspace Configuration',
      subtitle: 'System preferences, currency formats, and dummy database reset',
    },
  };

  const currentInfo = titles[currentTab] || titles.overview;

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/95 px-5 backdrop-blur-md sm:px-8">
      {/* Left: Mobile trigger & Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobile}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
              {currentInfo.title}
            </h1>
          </div>
          <p className="hidden text-xs text-slate-500 sm:block">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Actions, Date Badge, Notifications, CTA */}
      <div className="flex items-center gap-3">
        {/* Date Badge */}
        <div className="hidden md:flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
          <Calendar className="h-3.5 w-3.5 text-indigo-500" />
          <span>{currentDate || 'Today'}</span>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            aria-label="View recent activity"
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 z-50 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      System Activity
                    </span>
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                      Live
                    </span>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
                  {activities.map((act) => (
                    <div
                      key={act.id}
                      className="flex items-start gap-3 rounded-xl p-2 hover:bg-slate-50 transition"
                    >
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 font-bold text-[10px]">
                        {act.user.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-800">
                          <span className="text-indigo-600">{act.user}</span>{' '}
                          {act.action}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">{act.target}</p>
                        <p className="mt-0.5 text-[10px] text-slate-400">{act.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Primary Action Button */}
        <button
          onClick={onOpenAddEmployee}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 transition active:scale-98"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Employee</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>
    </header>
  );
}
