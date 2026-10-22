'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Mail,
  MapPin,
  Building2,
  LayoutList,
  LayoutGrid,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Employee, Department } from '@/types';
import { formatMoney, getInitials, formatDate } from '@/lib/storage';

interface EmployeesViewProps {
  employees: Employee[];
  departments: Department[];
  initialDepartmentFilter?: string;
  onOpenAddModal: () => void;
  onOpenEditModal: (emp: Employee) => void;
  onOpenViewDrawer: (emp: Employee) => void;
  onDeleteEmployee: (emp: Employee) => void;
  onExportCsv: () => void;
}

export function EmployeesView({
  employees,
  departments,
  initialDepartmentFilter = 'All',
  onOpenAddModal,
  onOpenEditModal,
  onOpenViewDrawer,
  onDeleteEmployee,
  onExportCsv,
}: EmployeesViewProps) {
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState(initialDepartmentFilter);
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const q = search.toLowerCase();
      const matchesSearch =
        emp.name.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.role.toLowerCase().includes(q) ||
        emp.id.toLowerCase().includes(q) ||
        emp.location.toLowerCase().includes(q);

      const matchesDept = departmentFilter === 'All' || emp.department === departmentFilter;
      const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;
      const matchesType = typeFilter === 'All' || emp.type === typeFilter;

      return matchesSearch && matchesDept && matchesStatus && matchesType;
    });
  }, [employees, search, departmentFilter, statusFilter, typeFilter]);

  const hasActiveFilters =
    search !== '' || departmentFilter !== 'All' || statusFilter !== 'All' || typeFilter !== 'All';

  const clearFilters = () => {
    setSearch('');
    setDepartmentFilter('All');
    setStatusFilter('All');
    setTypeFilter('All');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Action & Filter Bar */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, role, email or location..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition"
            />
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 self-end lg:self-auto">
            {/* View Mode Toggle */}
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                  viewMode === 'table'
                    ? 'bg-white text-indigo-600 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Table view"
              >
                <LayoutList className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                  viewMode === 'grid'
                    ? 'bg-white text-indigo-600 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={onExportCsv}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Add Employee</span>
            </button>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Filter className="h-3.5 w-3.5" />
            <span>Filters:</span>
          </div>

          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-indigo-400"
          >
            <option value="All">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-indigo-400"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Probation">Probation</option>
            <option value="Inactive">Inactive</option>
          </select>

          {/* Employment Type */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-indigo-400"
          >
            <option value="All">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 ml-auto"
            >
              <X className="h-3.5 w-3.5" />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Main Content: Table or Grid */}
      {viewMode === 'table' ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">Employee Details</th>
                  <th className="px-4 py-4">Department</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Type</th>
                  <th className="px-4 py-4">Salary (USD)</th>
                  <th className="px-4 py-4">Location</th>
                  <th className="px-4 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.map((emp) => {
                  const dept = departments.find((d) => d.name === emp.department);
                  return (
                    <tr
                      key={emp.id}
                      className="group hover:bg-slate-50/80 transition cursor-pointer"
                      onClick={() => onOpenViewDrawer(emp)}
                    >
                      {/* Name & Role */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-extrabold text-xs text-slate-800 shadow-2xs"
                            style={{ backgroundColor: emp.avatarBg }}
                          >
                            {getInitials(emp.name)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition">
                              {emp.name}
                            </div>
                            <div className="text-xs text-slate-400">
                              {emp.role} · <span className="font-mono text-[11px]">{emp.id}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="px-4 py-4">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold"
                          style={{
                            backgroundColor: `${dept?.color || '#6366f1'}15`,
                            color: dept?.color || '#4f46e5',
                          }}
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: dept?.color || '#6366f1' }}
                          />
                          {emp.department}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                            emp.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : emp.status === 'On Leave'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-indigo-50 text-indigo-700'
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {emp.status}
                        </span>
                      </td>

                      {/* Employment Type */}
                      <td className="px-4 py-4 text-xs font-medium text-slate-600">
                        {emp.type}
                      </td>

                      {/* Salary */}
                      <td className="px-4 py-4 font-bold text-slate-800">
                        {formatMoney(emp.salary)}
                      </td>

                      {/* Location */}
                      <td className="px-4 py-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1 truncate max-w-[140px]">
                          <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                          <span className="truncate">{emp.location}</span>
                        </div>
                      </td>

                      {/* Joined */}
                      <td className="px-4 py-4 text-xs text-slate-500">
                        {formatDate(emp.joined)}
                      </td>

                      {/* Actions */}
                      <td
                        className="px-6 py-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onOpenViewDrawer(emp)}
                            className="rounded-lg p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition"
                            title="View Full Profile"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onOpenEditModal(emp)}
                            className="rounded-lg p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition"
                            title="Edit Employee"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onDeleteEmployee(emp)}
                            className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                            title="Delete Employee"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredEmployees.length === 0 && (
            <div className="py-16 text-center">
              <Search className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm font-bold text-slate-800">No employees match criteria</p>
              <p className="text-xs text-slate-400">Try adjusting your search queries or active filters.</p>
              <button
                onClick={clearFilters}
                className="mt-4 text-xs font-bold text-indigo-600 hover:text-indigo-700"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Footer bar */}
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 text-xs text-slate-500">
            <span>
              Showing <strong className="text-slate-800">{filteredEmployees.length}</strong> of{' '}
              <strong className="text-slate-800">{employees.length}</strong> employees
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
              <ShieldCheck className="h-4 w-4" />
              Synced with localStorage database
            </span>
          </div>
        </div>
      ) : (
        /* Grid / Card View */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEmployees.map((emp) => {
            return (
              <div
                key={emp.id}
                onClick={() => onOpenViewDrawer(emp)}
                className="group relative rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:border-indigo-300 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl font-extrabold text-sm text-slate-800 shadow-2xs"
                      style={{ backgroundColor: emp.avatarBg }}
                    >
                      {getInitials(emp.name)}
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        emp.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : emp.status === 'On Leave'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-indigo-50 text-indigo-700'
                      }`}
                    >
                      {emp.status}
                    </span>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition">
                      {emp.name}
                    </h4>
                    <p className="text-xs text-slate-500">{emp.role}</p>
                    <p className="mt-0.5 text-[11px] font-mono text-slate-400">{emp.id}</p>
                  </div>

                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{emp.department}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{emp.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate text-indigo-600">{emp.email}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Salary</span>
                    <p className="text-xs font-bold text-slate-900">{formatMoney(emp.salary)}</p>
                  </div>

                  <div
                    className="flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => onOpenEditModal(emp)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition"
                      title="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteEmployee(emp)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
