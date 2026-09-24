import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function ChartsSection({ data }) {
  // Agrupar por Colonia (Top 5)
  const coloniaCounts = data.reduce((acc, curr) => {
    const col = curr.COLONIA || 'NO CAPTURADO';
    if (col !== 'No Capturado') {
      acc[col] = (acc[col] || 0) + 1;
    }
    return acc;
  }, {});

  const topColonias = Object.keys(coloniaCounts)
    .map(col => ({ name: col, total: coloniaCounts[col] }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  // Agrupar por Concepto / Medicamento (Top 5)
  const conceptoCounts = data.reduce((acc, curr) => {
    const con = curr.CONCEPTO || 'OTRO';
    acc[con] = (acc[con] || 0) + 1;
    return acc;
  }, {});

  const topConceptos = Object.keys(conceptoCounts)
    .map(con => ({ name: con, total: conceptoCounts[con] }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Gráfica de Top Colonias */}
      <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Top 5 Colonias con Mayor Afluencia</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topColonias} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="total" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfica de Top Conceptos/Medicamentos */}
      <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Top 5 Servicios / Medicamentos más Solicitados</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topConceptos} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={130} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="total" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}