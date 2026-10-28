import React from 'react';
import { Database, Key, GitFork, Code2, X, ShieldCheck } from 'lucide-react';
import { useDemo } from '../../context/DemoContext';

export const DBMSInspectorDrawer: React.FC = () => {
  const { inspectorData, closeInspector } = useDemo();

  if (!inspectorData) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden animate-slide-left">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900">DBMS Schema Inspector</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 uppercase tracking-wider">
                  Lab Viva Mode
                </span>
              </div>
              <p className="text-xs text-slate-500">Relational mapping & live query analysis</p>
            </div>
          </div>
          <button
            onClick={closeInspector}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Entity Name & Primary Key */}
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700">Relational Table</span>
            <div className="text-lg font-bold text-slate-900 mt-1">{inspectorData.entity}</div>

            <div className="mt-3 flex items-start gap-2 pt-3 border-t border-indigo-100/70">
              <Key className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-semibold text-slate-700">Primary Key Constraint:</span>
                <div className="text-xs font-mono font-medium text-indigo-950 mt-0.5 bg-white/80 px-2 py-1 rounded-md border border-indigo-100">
                  {inspectorData.primaryKey}
                </div>
              </div>
            </div>
          </div>

          {/* Foreign Keys & Referential Integrity */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              <GitFork className="w-4 h-4 text-indigo-600" />
              <span>Foreign Key Dependencies</span>
            </div>
            <div className="space-y-1.5">
              {inspectorData.foreignKeys.map((fk, idx) => (
                <div
                  key={idx}
                  className="text-xs font-mono bg-slate-50 border border-slate-200 text-slate-800 px-3 py-2 rounded-lg"
                >
                  {fk}
                </div>
              ))}
            </div>
          </div>

          {/* Cardinality & Relationships */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>ER Cardinality & Modeling</span>
            </div>
            <ul className="list-disc list-inside space-y-1 bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs text-slate-700">
              {inspectorData.relationships.map((rel, idx) => (
                <li key={idx} className="leading-relaxed">
                  {rel}
                </li>
              ))}
            </ul>
          </div>

          {/* Executed SQL Query */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              <Code2 className="w-4 h-4 text-purple-600" />
              <span>Equivalent Relational SQL Query</span>
            </div>
            <pre className="bg-slate-900 text-slate-100 text-xs p-3.5 rounded-xl font-mono overflow-x-auto leading-relaxed border border-slate-800">
              <code>{inspectorData.sampleSQL}</code>
            </pre>
          </div>

          {/* Live Tuple Attributes */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Current Tuple Attributes (JSON Data)
            </span>
            <pre className="bg-slate-100 text-slate-800 text-xs p-3.5 rounded-xl font-mono overflow-x-auto max-h-48 border border-slate-200">
              <code>{JSON.stringify(inspectorData.attributes, null, 2)}</code>
            </pre>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Netaji Subhas University of Technology</span>
          <span className="font-semibold text-indigo-600">DBMS Lab Project</span>
        </div>
      </div>
    </div>
  );
};
