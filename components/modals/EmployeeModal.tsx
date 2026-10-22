'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, User, Mail, Phone, MapPin, DollarSign, Calendar } from 'lucide-react';
import { Employee, Department, EmployeeStatus, EmploymentType } from '@/types';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: Employee) => void;
  departments: Department[];
  editingEmployee?: Employee | null;
}

const avatarColors = [
  '#dbeafe', // light blue
  '#e0e7ff', // indigo
  '#fce7f3', // pink
  '#ffedd5', // orange
  '#d1fae5', // emerald
  '#fef3c7', // amber
  '#ede9fe', // violet
  '#cffafe', // cyan
];

export function EmployeeModal({
  isOpen,
  onClose,
  onSave,
  departments,
  editingEmployee,
}: EmployeeModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState(departments[0]?.name || 'Engineering');
  const [status, setStatus] = useState<EmployeeStatus>('Active');
  const [type, setType] = useState<EmploymentType>('Full-time');
  const [salary, setSalary] = useState('');
  const [joined, setJoined] = useState('');
  const [location, setLocation] = useState('');
  const [manager, setManager] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    if (editingEmployee) {
      setName(editingEmployee.name);
      setEmail(editingEmployee.email);
      setPhone(editingEmployee.phone || '');
      setRole(editingEmployee.role);
      setDepartment(editingEmployee.department);
      setStatus(editingEmployee.status);
      setType(editingEmployee.type);
      setSalary(editingEmployee.salary.toString());
      setJoined(editingEmployee.joined);
      setLocation(editingEmployee.location || '');
      setManager(editingEmployee.manager || '');
      setBio(editingEmployee.bio || '');
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setRole('');
      setDepartment(departments[0]?.name || 'Engineering');
      setStatus('Active');
      setType('Full-time');
      setSalary('85000');
      setJoined(new Date().toISOString().slice(0, 10));
      setLocation('New York, NY');
      setManager('Team Lead');
      setBio('');
    }
  }, [editingEmployee, departments, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !role.trim()) return;

    const payload: Employee = {
      id: editingEmployee ? editingEmployee.id : `EMP-${1000 + Math.floor(Math.random() * 8999)}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || '+1 (555) 000-0000',
      role: role.trim(),
      department,
      status,
      type,
      salary: Number(salary) || 0,
      joined: joined || new Date().toISOString().slice(0, 10),
      location: location.trim() || 'Remote',
      manager: manager.trim() || 'Director',
      avatarBg: editingEmployee?.avatarBg || avatarColors[Math.floor(Math.random() * avatarColors.length)],
      bio: bio.trim() || `${role.trim()} in the ${department} department.`,
    };

    onSave(payload);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-xs"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative my-8 w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
              {editingEmployee ? 'Update Record' : 'New Personnel'}
            </span>
            <h3 className="mt-0.5 text-lg font-bold text-slate-900">
              {editingEmployee ? `Edit ${editingEmployee.name}` : 'Add New Employee'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Personal Information */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Personal Information
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700">Full Name *</label>
                <div className="relative mt-1.5">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Corporate Email *</label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex.morgan@company.com"
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Phone Number</label>
                <div className="relative mt-1.5">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 012-3456"
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Office / City Location</label>
                <div className="relative mt-1.5">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="New York, NY / Remote"
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Role & Department */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Role & Department
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700">Job Title / Role *</label>
                <input
                  required
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Employment Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as EmployeeStatus)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Probation">Probation</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Contract Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as EmploymentType)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
            </div>
          </div>

          {/* Compensation & Dates */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Compensation & Dates
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700">Annual Base Salary (USD)</label>
                <div className="relative mt-1.5">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="95000"
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Joining Date</label>
                <div className="relative mt-1.5">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="date"
                    value={joined}
                    onChange={(e) => setJoined(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 transition"
            >
              <Check className="h-4 w-4" />
              {editingEmployee ? 'Save Changes' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
