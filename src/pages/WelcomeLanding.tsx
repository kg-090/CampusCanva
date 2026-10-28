import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Layers,
  Sparkles,
  ArrowRight,
  Clock,
  MapPin,
  Image as ImageIcon,
  Users,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const WelcomeLanding: React.FC = () => {
  const { switchUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleQuickDemo = async (userId: number, roleName: string) => {
    await switchUser(userId);
    showToast(`Logged in as ${roleName} for live evaluation demo`, 'success');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Top Banner Navigation */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900">CampusCanva</span>
              <span className="ml-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                NSUT Delhi
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 rounded-xl transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-xs transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-6 animate-fade-in">
                <Sparkles className="w-3.5 h-3.5" />
                <span>DBMS Lab Project • Netaji Subhas University of Technology</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                Every moment has a place.
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800">
                  A Living Digital Archive.
                </span>
              </h1>

              <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                Instead of scattered photos across chat groups and personal drives, CampusCanva unites
                college memories into structured, context-rich <strong>Memory Spaces</strong> connected
                to campus spots, people, and time capsules.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition"
                >
                  <span>Enter Application</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/login"
                  className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm rounded-2xl shadow-xs transition"
                >
                  Sign In with Credentials
                </Link>
              </div>

              {/* Lab Evaluator Quick Login Card */}
              <div className="mt-10 p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xl max-w-xl mx-auto text-left">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Evaluator Quick Access (1-Click Demo)
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">No signup needed</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3">
                  <button
                    onClick={() => handleQuickDemo(1, 'Kavya Gupta (Student Lead)')}
                    className="p-3 rounded-2xl bg-indigo-50/70 hover:bg-indigo-100/70 border border-indigo-100 text-left transition group"
                  >
                    <div className="text-xs font-bold text-indigo-950 group-hover:text-indigo-600">
                      Kavya Gupta
                    </div>
                    <div className="text-[10px] text-indigo-600 font-semibold mt-0.5 uppercase">Student Role</div>
                    <div className="text-[10px] text-slate-400 mt-1">Roll: 2025UCS1583</div>
                  </button>

                  <button
                    onClick={() => handleQuickDemo(5, 'Prof. Vivek Mehta (Faculty)')}
                    className="p-3 rounded-2xl bg-purple-50/70 hover:bg-purple-100/70 border border-purple-100 text-left transition group"
                  >
                    <div className="text-xs font-bold text-purple-950 group-hover:text-purple-600">
                      Vivek Mehta Sir
                    </div>
                    <div className="text-[10px] text-purple-600 font-semibold mt-0.5 uppercase">Faculty Role</div>
                    <div className="text-[10px] text-slate-400 mt-1">CSE Dept Head</div>
                  </button>

                  <button
                    onClick={() => handleQuickDemo(7, 'Aman Verma (Alumni)')}
                    className="p-3 rounded-2xl bg-amber-50/70 hover:bg-amber-100/70 border border-amber-100 text-left transition group"
                  >
                    <div className="text-xs font-bold text-amber-950 group-hover:text-amber-600">
                      Aman Verma
                    </div>
                    <div className="text-[10px] text-amber-600 font-semibold mt-0.5 uppercase">Alumni Role</div>
                    <div className="text-[10px] text-slate-400 mt-1">Google • 2023 Batch</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Feature Cards Grid */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-lg transition">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Campus-First Spaces</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Every memory belongs to an event, batch, club, or landmark campus spot like Central
                  Lawn, Nescafe, or Admin Block.
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-lg transition">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Time-Locked Capsules</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Lock special batch memories and farewell messages with automated countdown timers that
                  reveal content strictly on your target graduation date.
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-lg transition">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Strong DBMS Modeling</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Built on strict RDBMS principles: ISA specialization, weak entity comments, composite
                  membership roles, and atomic transaction integrity.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>CampusCanva • DBMS Lab Project 2026 • NSUT Delhi</div>
          <div className="font-medium text-slate-700">
            Team: Kavya Gupta • Rohan Kumar • Ansh Dhillon • Lavanya Jain
          </div>
        </div>
      </footer>
    </div>
  );
};
