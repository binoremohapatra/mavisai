import React from 'react';
import { BookOpen, Calendar, Target } from 'lucide-react';

export default function AcademicScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Academic Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Course Card */}
          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-blue-400" /> Current Courses
            </h2>
            <div className="space-y-3">
              <div className="bg-slate-700/50 p-3 rounded-lg">
                <h3 className="font-medium">Computer Science 101</h3>
                <p className="text-sm text-slate-400">Progress: 45%</p>
              </div>
            </div>
          </div>

          {/* Goals Card */}
          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-green-400" /> Study Goals
            </h2>
            <p className="text-slate-400">No active goals set.</p>
          </div>
        </div>
        
        {/* New Human Animation System */}
        <div className="mt-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
          <h3 className="text-lg font-semibold mb-3">Human-Like Animation System</h3>
          <p className="text-sm text-slate-400 mb-4">
            Procedural character animation with human imperfection and behavior-driven motion
          </p>
          <div className="text-sm text-green-400">
            ✅ Professional VRM motion system implemented
          </div>
        </div>
      </div>
    </div>
  );
};
