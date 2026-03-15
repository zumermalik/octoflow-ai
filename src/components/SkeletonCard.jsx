import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-white/10"></div>
        <div className="w-24 h-4 rounded bg-white/10"></div>
      </div>
      <div className="space-y-2">
        <div className="w-full h-3 rounded bg-white/5"></div>
        <div className="w-5/6 h-3 rounded bg-white/5"></div>
        <div className="w-4/6 h-3 rounded bg-white/5"></div>
      </div>
    </div>
  );
}