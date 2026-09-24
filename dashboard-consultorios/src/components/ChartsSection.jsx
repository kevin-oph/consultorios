import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

export default function ChartsSection({ data }) {
  // 1. Procesar Top 5 Colonias con mayor afluencia
  const coloniasCount = {};
  data.forEach(item => {
    const col = item.COLONIA || 'No Capturado Por Usuario';
    coloniasCount[col] = (coloniasCount[col] || 0) + 1;
  });

  const topColonias = Object.entries(coloniasCount)
    .map(([colonia, count]) => ({ colonia, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // 2. Procesar Top 5 Servicios / Medicamentos
  const serviciosCount = {};
  data.forEach(item => {
    const servicio = item.SERVICIO || item.MEDICAMENTO || item.DESCRIPCION || item.CONCEPTO || 'CONSULTA GENERAL';
    serviciosCount[servicio] = (serviciosCount[servicio] || 0) + 1;
  });

  const topServicios = Object.entries(serviciosCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Paleta de colores variada y elegante para la dona
  const COLORS = ['#059669', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Gráfica 1: Top 5 Colonias (Barras) */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center justify-between">
          <span>Top 5 Colonias con Mayor Afluencia</span>
          <span className="text-xs font-normal text-gray-400">Volumen de atención</span>
        </h3>
        
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topColonias} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis dataKey="colonia" type="category" tick={{ fontSize: 10 }} width={90} stroke="#4b5563" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfica 2: Top 5 Servicios / Medicamentos (Gráfica de Dona con colores variados y texto optimizado) */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
        <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center justify-between">
          <span>Top 5 Servicios / Medicamentos Solicitados</span>
          <span className="text-xs font-normal text-gray-400">Distribución porcentual</span>
        </h3>
        
        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={topServicios}
                cx="50%"
                cy="45%"
                innerRadius={50}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                label={({ percent }) => percent > 0.03 ? `${(percent * 100).toFixed(0)}%` : ''}
                labelLine={false}
              >
                {topServicios.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '11px' }}
              />
              <Legend 
                verticalAlign="bottom" 
                align="center"
                height={50} 
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span className="text-[10px] text-gray-700 font-medium">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}