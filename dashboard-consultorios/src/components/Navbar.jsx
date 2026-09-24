import React from 'react';
import { Activity, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="bg-blue-900 text-white shadow-lg mb-6">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-800 p-2 rounded-lg border border-blue-700">
            <Activity className="text-emerald-400" size={28} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide">Municipio de Emiliano Zapata</h1>
            <p className="text-xs text-blue-300">Dashboard de Consultorios Médicos 24/7</p>
          </div>
        </div>
        <div className="mt-3 sm:mt-0 flex items-center space-x-2 bg-blue-800/60 px-3 py-1.5 rounded-full border border-blue-700 text-xs">
          <ShieldCheck size={16} className="text-emerald-400" />
          <span>Sistema de Reportes y Trazabilidad</span>
        </div>
      </div>
    </header>
  );
}