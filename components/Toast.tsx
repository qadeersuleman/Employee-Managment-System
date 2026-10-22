'use client';

import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export function Toast({ message, onClose }: ToastProps) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex max-w-md items-center gap-3 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-2xl border border-slate-800 transition-all animate-in fade-in slide-in-from-bottom-5">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
        <CheckCircle2 className="h-4 w-4" />
      </span>
      <span className="flex-1 text-xs text-slate-100">{message}</span>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-white transition p-1"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
